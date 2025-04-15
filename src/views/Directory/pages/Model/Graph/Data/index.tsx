import { useMemo } from 'react'
import { Edge, Node, Position } from 'reactflow'

import { ParsedManifestData } from '../manifestParser'
import { GraphData, markerEnd } from './graphData'

/**
 * Generates a graph data structure based on the input `types`.
 * The graph represents relationships between different types of objects and their permissions and relations.
 */
const GetGraphData = (
  parsedManifest: ParsedManifestData[],
  nodeStyle: (nodeType: string) => {
    borderColor: string
    borderRadius: string
    borderStyle: string
    borderWidth: string
  },
): GraphData => {
  return useMemo(() => {
    // base horizontal position
    let baseY = 0

    // base position step
    const step = 84

    // // initial X position
    const objectsX = 40
    const permissionsX = 340
    const operatorsX = 600
    const relationsX = 820
    const subjectsX = 1120

    const objectNodes: Node[] = []
    const subjectNodes: Node[] = []
    const relationNodes: Node[] = []
    const permissionNodes: Node[] = []
    const operatorNodes: Node[] = []
    const objectEdges: Edge[] = []
    const permissionEdges: Edge[] = []
    const operatorEdges: Edge[] = []
    const relationEdges: Edge[] = []

    parsedManifest.forEach((data) => {
      let currentDepth = 1

      const relations = data.relations || []
      const relationsDepth = relations.length
      if (relationsDepth > currentDepth) {
        currentDepth = relationsDepth
      }
      let subjectsCount = 0
      const uniqueSubjects = relations
        .flatMap((relation) => {
          return relation.subjects || []
        })
        .filter((value, index, array) => array.indexOf(value) === index).length
      relations.forEach((relation, relationIndex) => {
        const subjects = relation.subjects || []
        const subjectsDepth = subjects.length
        if (subjectsDepth > currentDepth) {
          currentDepth = subjectsDepth
        }

        relationNodes.push({
          data: {
            context: data.object,
            label: relation.key,
            sourceHandle: true,
            targetHandle: true,
            toolbarValue: relation.key,
          },
          id: `${data.object}-${relation.key}`,
          position: {
            x: relationsX,
            y:
              subjectsDepth <= 2
                ? baseY + relationIndex * step
                : baseY +
                  (Math.round(uniqueSubjects / 2) - 2 + relationIndex) * step,
          },
          sourcePosition: Position.Right,
          style: nodeStyle('relation'),
          targetPosition: Position.Left,
          type: 'relation',
        })

        // Arrow operator edges
        Object.entries(relation.permissions || {}).forEach(([_key, values]) => {
          values.forEach((value) => {
            relation.subjects.forEach((subject) => {
              const target =
                subject === data.object ? 'relation' : 'parent-relation'
              const id = `${data.object}-${relation.key}:${subject}-${value}`
              const edgeExists = relationEdges.findIndex(
                (relationEdge) => relationEdge.id === id,
              )
              if (edgeExists === -1) {
                relationEdges.push({
                  id: `${id}`,
                  markerEnd: markerEnd,
                  source: `${data.object}-${relation.key}`,
                  sourceHandle: 'permission',
                  style: { strokeDasharray: '5' },
                  target: `${subject}-${value}`,
                  targetHandle: target,
                  type: 'smoothstep',
                })
              }
            })
          })
        })

        subjects.forEach((subject) => {
          let existingCount = 0
          const existingSubject =
            subjectNodes.filter(
              (sn) => sn.id === `${data.object}-${subject}-subject`,
            ).length > 0

          if (!existingSubject) {
            subjectNodes.push({
              data: {
                context: data.object,
                label: subject,
                sourceHandle: true,
                targetHandle: true,
                toolbarValue: subject,
              },
              id: `${data.object}-${subject}-subject`,
              position: {
                x: subjectsX,
                y: baseY + (subjectsCount - existingCount) * step,
              },
              sourcePosition: Position.Right,
              style: nodeStyle('object'),
              targetPosition: Position.Left,
              type: 'subject',
            })
            subjectsCount = subjectsCount + 1
          } else {
            existingCount = existingCount + 1
          }

          if (subjectsCount - existingCount > currentDepth) {
            currentDepth = subjectsCount - existingCount
          }

          relationEdges.push({
            id: `${data.object}-${relation.key}:${data.object}-${subject}-subject`,
            markerEnd: markerEnd,
            source: `${data.object}-${relation.key}`,
            target: `${data.object}-${subject}-subject`,
          })
        })

        // If there are no permissions for this relation, create an edge between object and relation
        if (
          data.permissions?.filter((permission) =>
            permission.relations.has(relation.key!),
          ).length === 0
        ) {
          objectEdges.push({
            id: `${data.object}-object:${data.object}-${relation.key}`,
            markerEnd: markerEnd,
            source: `${data.object}-object`,
            target: `${data.object}-${relation.key}`,
          })
        }
      })

      const permissions = data.permissions || []
      const permissionsDepth = permissions.length
      if (permissionsDepth > currentDepth) {
        currentDepth = permissionsDepth
      }
      permissions.forEach((permission, permissionIndex) => {
        permissionNodes.push({
          data: {
            context: data.object,
            label: permission.key,
            sourceHandle: true,
            targetHandle: true,
            toolbarValue: permission.key,
          },
          id: `${data.object}-${permission.key}`,
          position: {
            x: permissionsX,
            y: baseY + permissionIndex * step,
          },
          sourcePosition: Position.Right,
          style: nodeStyle('permission'),
          targetPosition: Position.Left,
          type: 'permission',
        })
        operatorNodes.push({
          data: {
            context: data.object,
            label: permission.operator,
            permission: permission.key,
            sourceHandle: true,
            targetHandle: true,
          },
          id: `${data.object}-${permission.key}-${permission.operator}`,
          position: { x: operatorsX, y: baseY + permissionIndex * step },
          sourcePosition: Position.Right,
          style: nodeStyle('operator'),
          targetPosition: Position.Left,
          type: 'operator',
        })

        objectEdges.push({
          id: `${data.object}-object:${data.object}-${permission.key}`,
          markerEnd: markerEnd,
          source: `${data.object}-object`,
          target: `${data.object}-${permission.key}`,
        })

        permissionEdges.push({
          id: `${data.object}-${permission.key}:${data.object}-${permission.key}-${permission.operator}`,
          markerEnd: markerEnd,
          source: `${data.object}-${permission.key}`,
          target: `${data.object}-${permission.key}-${permission.operator}`,
        })

        const permissionsKeys = permissions.map((permission) => permission.key)
        permission.relations.forEach((relation) => {
          const isPermission = permissionsKeys.includes(relation)
          operatorEdges.push({
            id: `${data.object}-${permission.key}-${permission.operator}:${data.object}-${relation}`,
            markerEnd: markerEnd,
            source: `${data.object}-${permission.key}-${permission.operator}`,
            sourceHandle: isPermission ? 'permission' : undefined,
            target: `${data.object}-${relation}`,
            targetHandle: isPermission ? 'permission' : undefined,
            type: isPermission ? 'smoothstep' : 'default',
          })
        })
      })

      objectNodes.push({
        data: {
          context: data.object,
          label: data.object,
          sourceHandle: true,
          toolbarValue: data.object,
        },
        id: `${data.object}-object`,
        position: {
          x: objectsX,
          y: baseY + (Math.round(currentDepth / 2) - 1) * step,
        },
        sourcePosition: Position.Right,
        style: nodeStyle('object'),
        type: 'object',
      })

      // set the new base
      baseY = baseY + currentDepth * step
    })

    return {
      edges: objectEdges
        .concat(permissionEdges)
        .concat(operatorEdges)
        .concat(relationEdges),

      nodes: objectNodes
        .concat(operatorNodes)
        .concat(permissionNodes)
        .concat(relationNodes)
        .concat(subjectNodes),
    }
  }, [parsedManifest, nodeStyle])
}

export default GetGraphData
