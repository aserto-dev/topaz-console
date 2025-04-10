import { useMemo } from "react";
import { Edge, MarkerType, Node, Position } from "reactflow";

import { theme } from "../../../../../theme";
import { ParsedManifestData } from "./manifestParser";

export type GraphData = {
  nodes: Node[];
  edges: Edge[];
};

export const markerEnd = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: theme.grey60,
};
/**
 * Generates a graph data structure based on the input `types`.
 * The graph represents relationships between different types of objects and their permissions and relations.
 */
const GetGraphData = (
  parsedManifest: ParsedManifestData[],
  nodeStyle: (nodeType: string) => {
    borderRadius: string;
    borderColor: string;
    borderWidth: string;
    borderStyle: string;
  }
): GraphData => {
  return useMemo(() => {
    // base horizontal position
    let baseY = 0;

    // base position step
    const step = 84;

    // // initial X position
    const objectsX = 40;
    const permissionsX = 340;
    const operatorsX = 600;
    const relationsX = 820;
    const subjectsX = 1120;

    const objectNodes: Node[] = [];
    const subjectNodes: Node[] = [];
    const relationNodes: Node[] = [];
    const permissionNodes: Node[] = [];
    const operatorNodes: Node[] = [];
    const objectEdges: Edge[] = [];
    const permissionEdges: Edge[] = [];
    const operatorEdges: Edge[] = [];
    const relationEdges: Edge[] = [];

    parsedManifest.forEach((data) => {
      let currentDepth = 1;

      const relations = data.relations || [];
      const relationsDepth = relations.length;
      if (relationsDepth > currentDepth) {
        currentDepth = relationsDepth;
      }
      let subjectsCount = 0;
      const uniqueSubjects = relations
        .flatMap((relation) => {
          return relation.subjects || [];
        })
        .filter((value, index, array) => array.indexOf(value) === index).length;
      relations.forEach((relation, relationIndex) => {
        const subjects = relation.subjects || [];
        const subjectsDepth = subjects.length;
        if (subjectsDepth > currentDepth) {
          currentDepth = subjectsDepth;
        }

        relationNodes.push({
          id: `${data.object}-${relation.key}`,
          type: "relation",
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          data: {
            context: data.object,
            label: relation.key,
            sourceHandle: true,
            targetHandle: true,
            toolbarValue: relation.key,
          },
          position: {
            x: relationsX,
            y:
              subjectsDepth <= 2
                ? baseY + relationIndex * step
                : baseY +
                  (Math.round(uniqueSubjects / 2) - 2 + relationIndex) * step,
          },
          style: nodeStyle("relation"),
        });

        // Arrow operator edges
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(relation.permissions || {}).forEach(([_key, values]) => {
          values.forEach((value) => {
            relation.subjects.forEach((subject) => {
              const target =
                subject === data.object ? "relation" : "parent-relation";
              const id = `${data.object}-${relation.key}:${subject}-${value}`;
              const edgeExists = relationEdges.findIndex(
                (relationEdge) => relationEdge.id === id
              );
              if (edgeExists === -1) {
                relationEdges.push({
                  id: `${id}`,
                  source: `${data.object}-${relation.key}`,
                  target: `${subject}-${value}`,
                  sourceHandle: "permission",
                  targetHandle: target,
                  markerEnd: markerEnd,
                  type: "smoothstep",
                  style: { strokeDasharray: "5" },
                });
              }
            });
          });
        });

        subjects.forEach((subject) => {
          let existingCount = 0;
          const existingSubject =
            subjectNodes.filter(
              (sn) => sn.id === `${data.object}-${subject}-subject`
            ).length > 0;

          if (!existingSubject) {
            subjectNodes.push({
              id: `${data.object}-${subject}-subject`,
              type: "subject",
              sourcePosition: Position.Right,
              targetPosition: Position.Left,
              data: {
                context: data.object,
                label: subject,
                sourceHandle: true,
                targetHandle: true,
                toolbarValue: subject,
              },
              position: {
                x: subjectsX,
                y: baseY + (subjectsCount - existingCount) * step,
              },
              style: nodeStyle("object"),
            });
            subjectsCount = subjectsCount + 1;
          } else {
            existingCount = existingCount + 1;
          }

          if (subjectsCount - existingCount > currentDepth) {
            currentDepth = subjectsCount - existingCount;
          }

          relationEdges.push({
            id: `${data.object}-${relation.key}:${data.object}-${subject}-subject`,
            source: `${data.object}-${relation.key}`,
            target: `${data.object}-${subject}-subject`,
            markerEnd: markerEnd,
          });
        });

        // If there are no permissions for this relation, create an edge between object and relation
        if (
          data.permissions?.filter((permission) =>
            permission.relations.has(relation.key!)
          ).length === 0
        ) {
          objectEdges.push({
            id: `${data.object}-object:${data.object}-${relation.key}`,
            source: `${data.object}-object`,
            target: `${data.object}-${relation.key}`,
            markerEnd: markerEnd,
          });
        }
      });

      const permissions = data.permissions || [];
      const permissionsDepth = permissions.length;
      if (permissionsDepth > currentDepth) {
        currentDepth = permissionsDepth;
      }
      permissions.forEach((permission, permissionIndex) => {
        permissionNodes.push({
          id: `${data.object}-${permission.key}`,
          type: "permission",
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          data: {
            context: data.object,
            label: permission.key,
            sourceHandle: true,
            targetHandle: true,
            toolbarValue: permission.key,
          },
          position: {
            x: permissionsX,
            y: baseY + permissionIndex * step,
          },
          style: nodeStyle("permission"),
        });
        operatorNodes.push({
          id: `${data.object}-${permission.key}-${permission.operator}`,
          type: "operator",
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          data: {
            context: data.object,
            permission: permission.key,
            label: permission.operator,
            sourceHandle: true,
            targetHandle: true,
          },
          position: { x: operatorsX, y: baseY + permissionIndex * step },
          style: nodeStyle("operator"),
        });

        objectEdges.push({
          id: `${data.object}-object:${data.object}-${permission.key}`,
          source: `${data.object}-object`,
          target: `${data.object}-${permission.key}`,
          markerEnd: markerEnd,
        });

        permissionEdges.push({
          id: `${data.object}-${permission.key}:${data.object}-${permission.key}-${permission.operator}`,
          source: `${data.object}-${permission.key}`,
          target: `${data.object}-${permission.key}-${permission.operator}`,
          markerEnd: markerEnd,
        });

        const permissionsKeys = permissions.map((permission) => permission.key);
        permission.relations.forEach((relation) => {
          const isPermission = permissionsKeys.includes(relation);
          operatorEdges.push({
            id: `${data.object}-${permission.key}-${permission.operator}:${data.object}-${relation}`,
            source: `${data.object}-${permission.key}-${permission.operator}`,
            target: `${data.object}-${relation}`,
            sourceHandle: isPermission ? "permission" : undefined,
            targetHandle: isPermission ? "permission" : undefined,
            markerEnd: markerEnd,
            type: isPermission ? "smoothstep" : "default",
          });
        });
      });

      objectNodes.push({
        id: `${data.object}-object`,
        type: "object",
        sourcePosition: Position.Right,
        data: {
          context: data.object,
          label: data.object,
          sourceHandle: true,
          toolbarValue: data.object,
        },
        position: {
          x: objectsX,
          y: baseY + (Math.round(currentDepth / 2) - 1) * step,
        },
        style: nodeStyle("object"),
      });

      // set the new base
      baseY = baseY + currentDepth * step;
    });

    return {
      nodes: objectNodes
        .concat(operatorNodes)
        .concat(permissionNodes)
        .concat(relationNodes)
        .concat(subjectNodes),

      edges: objectEdges
        .concat(permissionEdges)
        .concat(operatorEdges)
        .concat(relationEdges),
    };
  }, [parsedManifest, nodeStyle]);
};

export default GetGraphData;
