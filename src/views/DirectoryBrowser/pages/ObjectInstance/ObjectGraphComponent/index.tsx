import 'reactflow/dist/style.css'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Controls,
  Edge,
  EdgeMarker,
  EdgeTypes,
  isEdge,
  isNode,
  MarkerType,
  Node,
  NodeTypes,
  Panel,
  useEdgesState,
  useNodesState,
} from 'reactflow'

import { theme } from '../../../../../theme'
import {
  V3GetRelationsResponseObjects,
  V3Object,
  V3Relation,
} from '../../../../../types/directory'
import { computeColor } from './colors'
import CustomEdge from './CustomEdge'
import CustomNode, { Filter, FilterSpan, ResetFilter } from './CustomNode'
import { useDirectoryReaderV3RelationsListInfinite } from '../../../../../api/v3/directory'
import { getNextPage } from '../../../../../api/directory/customQuery'

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

type ObjectGraphComponentProps = {
  object: V3Object
  setObject: (object: V3Object) => void
}

const ObjectGraphComponent: React.FC<ObjectGraphComponentProps> = ({
  object,
  setObject,
}) => {
  const { id: objectId, type: objectType } = object

  const [objectTypeFilter, setObjectTypeFilter] = useState<string | undefined>(
    undefined,
  )
  const [nodes, setNodes] = useNodesState([])
  const [edges, setEdges] = useEdgesState([])

  const { data: outgoingRelationsData } =
    useDirectoryReaderV3RelationsListInfinite(
      {
        object_id: objectId,
        object_type: objectType,
        with_objects: true,
        'page.size': 100,
      },
      {
        query: {
          meta: {
            showError: true,
          },
          getNextPageParam: getNextPage,
        },
      },
    )

  const { data: incomingRelationsData } =
    useDirectoryReaderV3RelationsListInfinite(
      {
        subject_id: object?.id || objectId,
        subject_type: object?.type || objectType,
        with_objects: true,
        'page.size': 100,
      },
      {
        query: {
          meta: {
            showError: true,
          },
          getNextPageParam: getNextPage,
        },
      },
    )

  const objects: V3GetRelationsResponseObjects = useMemo(() => {
    return {}
  }, [])

  const incomingRelations: V3Relation[] = useMemo(() => {
    const incomingRelations =
      incomingRelationsData?.pages
        .map((relation) => {
          Object.assign(objects, relation.objects)
          return relation.results || []
        })
        .flat() || []
    if (objectTypeFilter) {
      return incomingRelations.filter(
        (relation) => relation.object_type === objectTypeFilter,
      )
    }

    return incomingRelations
  }, [incomingRelationsData?.pages, objects, objectTypeFilter])

  const outgoingRelations: V3Relation[] = useMemo(() => {
    const outgoingRelations =
      outgoingRelationsData?.pages
        .map((relation) => {
          Object.assign(objects, relation.objects)
          return relation.results || []
        })
        .flat() || []
    if (objectTypeFilter) {
      return outgoingRelations.filter(
        (relation) => relation.subject_type === objectTypeFilter,
      )
    }
    return outgoingRelations
  }, [outgoingRelationsData?.pages, objects, objectTypeFilter])

  const toggleObjectTypeFilter = useCallback(
    ({ objectType }: { objectType: string }) => {
      setObjectTypeFilter((prev) => {
        if (objectType === prev) {
          return undefined
        }
        return objectType
      })
    },
    [],
  )

  const objectNode: Node[] = useMemo(() => {
    if (!!objectType && !!objectId) {
      return [
        {
          id: `object:${objectType}:${objectId}`,
          type: 'custom',
          data: {
            label:
              object?.display_name ||
              objects[`${objectType}:${objectId}`]?.display_name ||
              objectId,
            targetHandle: true,
            sourceHandle: true,
            color: computeColor(objectType),
            objectType: { name: objectType, value: objectType },
            id: objectId,
            onObjectTypeClick: toggleObjectTypeFilter,
          },
          position: { x: 450, y: 200 },
        },
      ]
    }
    return []
  }, [
    objectId,
    objectType,
    object?.display_name,
    toggleObjectTypeFilter,
    objects,
  ])

  const incomingNodes: Node[] = useMemo(
    () =>
      incomingRelations.map((o, i) => ({
        id: `incoming:${o?.object_type}:${o?.object_id}#${o.relation}#${o.subject_relation || ''}`,
        type: 'custom',
        data: {
          label:
            objects[`${o?.object_type}:${o?.object_id}`]?.display_name ||
            o?.object_id,
          sourceHandle: true,
          color: computeColor(o?.object_type || ''),
          objectType: { name: o?.object_type, value: o?.object_type },
          id: o?.object_id,
          onObjectTypeClick: toggleObjectTypeFilter,
        },
        position: { x: 50, y: 100 * i + 50 },
      })),
    [incomingRelations, toggleObjectTypeFilter, objects],
  )

  const incomingEdges: Edge[] = useMemo(
    () =>
      incomingRelations.map((o) => {
        const id = `incoming-e${o?.object_type}:${o?.object_id}#${o.relation}-${o?.subject_type}:${
          o?.subject_id
        }#${o.subject_relation || ''}`
        return {
          id,
          data: o.subject_relation
            ? {
                startLabel: o.relation,
                subjectRelation: { val: o.subject_relation, highlight: false },
              }
            : { startLabel: o?.relation },
          source: `incoming:${o?.object_type}:${o?.object_id}#${o.relation}#${
            o.subject_relation || ''
          }`,
          target: `object:${o?.subject_type}:${o?.subject_id}`,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: o.subject_relation ? 10 : 20,
            height: o.subject_relation ? 10 : 20,
            color: `${theme.grey50}`,
          },
          type: 'custom',
        }
      }),
    [incomingRelations],
  )

  const outgoingNodes: Node[] = useMemo(
    () =>
      outgoingRelations.map((o, i) => ({
        id: `outgoing:${o?.subject_type}:${o?.subject_id}#${o.relation}#${
          o.subject_relation || ''
        }`,
        type: 'custom',
        data: {
          label:
            objects[`${o?.subject_type}:${o?.subject_id}`]?.display_name ||
            o?.subject_id,
          targetHandle: true,
          color: computeColor(o?.subject_type || ''),
          objectType: {
            name: o.subject_relation
              ? `${o?.subject_type}#${o?.subject_relation}`
              : o?.subject_type,
            value: o?.subject_type,
          },
          id: o?.subject_id,
          onObjectTypeClick: toggleObjectTypeFilter,
        },
        position: { x: 850, y: 100 * i + 50 },
      })),
    [outgoingRelations, toggleObjectTypeFilter, objects],
  )

  const outgoingEdges: Edge[] = useMemo(
    () =>
      outgoingRelations.map((o) => ({
        id: `outgoing-e${o?.object_type}:${o?.object_id}#${o.relation}-${o?.subject_type}:${
          o?.subject_id
        }#${o.subject_relation || ''}`,
        data: o.subject_relation
          ? {
              endLabel: o.relation,
              subjectRelation: { val: o.subject_relation, highlight: false },
            }
          : { endLabel: o?.relation },
        source: `object:${o?.object_type}:${o?.object_id}`,
        target: `outgoing:${o?.subject_type}:${o?.subject_id}#${o.relation}#${
          o.subject_relation || ''
        }`,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: o.subject_relation ? 10 : 20,
          height: o.subject_relation ? 10 : 20,
          color: `${theme.grey50}`,
        },
        type: 'custom',
      })),
    [outgoingRelations],
  )

  const allNodes = useMemo(() => {
    return objectNode.concat(outgoingNodes).concat(incomingNodes)
  }, [incomingNodes, outgoingNodes, objectNode])

  const allEdges = useMemo(() => {
    return incomingEdges.concat(outgoingEdges)
  }, [incomingEdges, outgoingEdges])

  useEffect(() => {
    setNodes(allNodes)
  }, [setNodes, allNodes])

  useEffect(() => {
    setEdges(allEdges)
  }, [setEdges, allEdges])

  const highlightPath = (edge: Edge, edges: Edge[]) => {
    const incomingNode = edge.source
    const centerNode = edge.target
    const outgoingRelationEdges = edges.filter(
      (e) => e.data?.endLabel === edge.data.subjectRelation.val,
    )

    const nodeIds = [incomingNode, centerNode].concat(
      outgoingRelationEdges.map((o) => o.target),
    )
    const edgeIds = [edge.id].concat(outgoingRelationEdges.map((o) => o.id))

    setNodes((prevElements) =>
      prevElements?.map((elem) => {
        if (isNode(elem)) {
          elem.style = {
            ...elem.style,
            borderWidth: '2px',
            borderColor: nodeIds.includes(elem.id)
              ? theme.grey100
              : theme.grey30,
            opacity: nodeIds.includes(elem.id) ? 1 : 0.25,
          }
          if (elem.id === centerNode) {
            elem.data = {
              ...elem.data,
              subjectRelationLabel: `#${edge.data.subjectRelation.val}`,
            }
          }
        }
        return elem
      }),
    )

    setEdges((previousEdges) =>
      previousEdges?.map((elem) => {
        const highlight = edgeIds.includes(elem.id)
        elem.style = {
          stroke: highlight ? theme.grey100 : theme.grey50,
          opacity: highlight ? 1 : 0.25,
          color: theme.grey100,
        }

        elem.markerEnd = {
          ...(elem.markerEnd as EdgeMarker),
          color: highlight ? theme.grey100 : theme.grey50,
        }
        if (elem.data.subjectRelation) {
          elem.data = {
            ...elem.data,
            subjectRelation: { ...elem.data.subjectRelation, highlight },
          }
        }
        return elem
      }),
    )
  }

  const resetNodeStyles = () => {
    setNodes((prevElements) =>
      prevElements?.map((elem) => {
        if (isNode(elem)) {
          elem.style = {
            ...elem.style,
            borderColor: theme.grey30,
            borderWidth: '1px',
            opacity: 1,
          }

          if (elem.data.subjectRelationLabel) {
            const { ...newData } = elem.data
            elem.data = newData
          }
        }
        return elem
      }),
    )

    setEdges((prevElements) =>
      prevElements?.map((elem) => {
        if (isEdge(elem)) {
          if (elem.data.subjectRelation) {
            elem.data = {
              ...elem.data,
              subjectRelation: {
                ...elem.data.subjectRelation,
                highlight: false,
              },
            }
          }
          elem.style = {
            ...elem.style,
            stroke: theme.grey60,
            opacity: 1,
          }
          elem.markerEnd = {
            ...(elem.markerEnd as EdgeMarker),
            color: theme.grey50,
          }
        }
        return elem
      }),
    )
  }

  return (
    <ReactFlow
      edges={edges}
      edgeTypes={edgeTypes}
      nodes={nodes}
      nodesConnectable={false}
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
      onEdgeMouseEnter={(_e, edge) =>
        edge.target === objectNode[0].id &&
        !!edge.data.subjectRelation &&
        highlightPath(edge, edges)
      }
      onEdgeMouseLeave={(_e, edge) =>
        edge.target === objectNode[0].id &&
        !!edge.data.subjectRelation &&
        resetNodeStyles()
      }
      onNodeClick={(_e, node) => {
        const object: V3Object = {
          id: node.data.id,
          type: node.data.objectType.value,
        }
        setObject(object)
      }}
    >
      <Panel
        hidden={!objectTypeFilter}
        position="top-right"
        style={{
          backgroundColor: theme.primaryBlack,
          opacity: 0.95,
          padding: '15px 8px',
          marginTop: '0px',
          borderRadius: '2px',
        }}
      >
        <FilterSpan>Filter:</FilterSpan>
        <Filter node={objectTypeFilter!} variant="secondary-borderless">
          {objectTypeFilter}
        </Filter>
        <ResetFilter
          variant="secondary-borderless"
          onClick={() => {
            setObjectTypeFilter(undefined)
          }}
        >
          x
        </ResetFilter>
      </Panel>
      <Controls position="top-right" />
    </ReactFlow>
  )
}

export default ObjectGraphComponent
