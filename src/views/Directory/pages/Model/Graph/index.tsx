import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  Edge,
  EdgeChange,
  isEdge,
  isNode,
  MarkerType,
  Node,
  NodeChange,
  NodeTypes,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useStore,
} from 'reactflow'
import 'reactflow/dist/style.css'
import styled from 'styled-components'

import {
  useManifest,
  useManifestToYaml,
} from '../../../../../api/directory/parsers/manifest'
import NoModel from '../../../../../assets/nomodel.svg'
import EmptyTablePlaceholder from '../../../../../components/common/EmptyTablePlaceholder'
import { useDirectoryModelContext } from '../../../../../services/DirectoryContextProvider/hooks'
import { theme } from '../../../../../theme'
import {
  ObjectTypeNode,
  OperatorNode,
  PermissionNode,
  RelationTypesNode,
} from './CustomNodes'
import { computeColor } from './CustomNodes/colors'
import GetGraphData from './Data'
import { GraphData, markerEnd } from './Data/graphData'
import parseManifest from './manifestParser'
import mapNodePath from './mapNodePath'

const ReactFlowContainer = styled.div`
  height: calc(100vh - 160px);
  width: 100%;
  @media (max-width: 912px) {
    height: calc(100vh - 230px);
  }
  .react-flow {
    margin-top: 20px;
  }
  .react-flow__minimap {
    background-color: ${theme.primaryBlack};
    border: 1px solid ${theme.grey30};
  }
  .react-flow__node-custom {
    border: 1px solid ${theme.grey30};
    border-radius: 5px;
    text-align: center;
    &:hover {
      cursor: pointer;
    }
  }
`

const nodeTypes: NodeTypes = {
  object: ObjectTypeNode,
  operator: OperatorNode,
  permission: PermissionNode,
  relation: RelationTypesNode,
  subject: ObjectTypeNode,
}

const ModelFlow = () => {
  const { code } = useDirectoryModelContext()

  const [nodes, setNodes] = useNodesState([])
  const [edges, setEdges] = useEdgesState([])
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  )
  const { data: initialManifest, isLoading } = useManifest()
  const manifest = useManifestToYaml(code) || initialManifest

  const nodeStyle = useCallback((nodeType: string) => {
    return {
      backgroundColor: theme.primaryBlack,
      borderColor: computeColor(nodeType).borderColor,
      borderRadius: nodeType === 'object' ? '16px' : '4px',
      borderStyle: 'solid',
      borderWidth: '1px',
    }
  }, [])

  const parsedManifest = useMemo(() => parseManifest(manifest), [manifest])

  const data: GraphData = GetGraphData(parsedManifest, nodeStyle)

  useEffect(() => {
    setNodes(data.nodes)
  }, [setNodes, data.nodes])

  useEffect(() => {
    setEdges(data.edges)
  }, [setEdges, data.edges])

  const highlightPath = (
    node: Node,
    nodes: Node[],
    edges: Edge[],
    selection: boolean,
  ) => {
    const getNodePath = mapNodePath(parsedManifest)

    if (node && [...nodes, ...edges]) {
      const incomerIds = getNodePath(node)
      const outgoerIds = getNodePath(node)

      setNodes((prevElements) => {
        return prevElements?.map((elem) => {
          if (
            isNode(elem) &&
            (incomerIds.length > 0 || outgoerIds.length > 0)
          ) {
            const highlight =
              elem.id === node.id ||
              incomerIds.includes(elem.id) ||
              outgoerIds.includes(elem.id)

            elem.style = {
              ...elem.style,
              backgroundColor: highlight
                ? computeColor(elem.type!).backgroundColor
                : theme.primaryBlack,
              opacity: highlight ? 1 : 0.25,
            }
            elem.data = { ...elem.data, toolbarVisible: highlight }
          }

          return elem
        })
      })

      setEdges((previousEdges) => {
        return previousEdges?.map((elem) => {
          if (selection) {
            const active =
              (elem.source === node.id && outgoerIds.includes(elem.target)) ||
              (elem.target === node.id && incomerIds.includes(elem.source)) ||
              (outgoerIds.includes(elem.source) &&
                outgoerIds.includes(elem.target)) ||
              (incomerIds.includes(elem.source) &&
                incomerIds.includes(elem.target))

            elem.style = {
              ...elem.style,
              opacity: active ? 1 : 0,
              stroke: active ? theme.grey100 : theme.grey60,
            }

            elem.markerEnd = {
              color: active ? theme.grey100 : theme.grey60,
              height: 20,
              type: MarkerType.ArrowClosed,
              width: 20,
            }
          } else {
            elem.style = {
              ...elem.style,
              opacity: 1,
              stroke: theme.grey60,
            }
          }
          return elem
        })
      })
    }
  }

  const resetNodeStyles = () => {
    setNodes((prevElements) => {
      return prevElements?.map((elem) => {
        if (isNode(elem)) {
          elem.style = {
            ...elem.style,
            backgroundColor: theme.primaryBlack,
            borderWidth: '1px',
            opacity: 1,
          }

          elem.data = { ...elem.data, toolbarVisible: false }
        }
        return elem
      })
    })

    setEdges((prevElements) => {
      return prevElements?.map((elem) => {
        if (isEdge(elem)) {
          elem.style = {
            ...elem.style,
            opacity: 1,
            stroke: theme.grey60,
          }
          elem.markerEnd = markerEnd
        }
        return elem
      })
    })
  }

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>()
  const onInit = (rfi: ReactFlowInstance) => setReactFlowInstance(rfi)

  const [selectedNode, setSelectedNode] = useState<Node>()
  const widthSelector = (state: { width: unknown }) => state.width
  const heightSelector = (state: { height: unknown }) => state.height
  const reactFlowWidth = useStore(widthSelector)
  const reactFlowHeight = useStore(heightSelector)

  useEffect(() => {
    reactFlowInstance?.fitView()
  }, [reactFlowWidth, reactFlowHeight, reactFlowInstance])

  if (isLoading) {
    return null
  }

  if (!manifest) {
    return (
      <EmptyTablePlaceholder
        body=""
        header="No model"
        imgAlt="no model view"
        imgSrc={NoModel}
      />
    )
  }

  return (
    <ReactFlowContainer>
      <ReactFlow
        edges={edges}
        elementsSelectable={true}
        fitView
        nodes={nodes}
        nodesConnectable={false}
        nodesDraggable={false}
        nodeTypes={nodeTypes}
        preventScrolling={true}
        proOptions={{ hideAttribution: true }}
        snapGrid={[10, 10]}
        snapToGrid={true}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        onNodeClick={(_event, node) => {
          setSelectedNode(node)
          highlightPath(node, nodes, edges, true)
        }}
        onNodeMouseEnter={(_event, node) =>
          !selectedNode && highlightPath(node, nodes, edges, true)
        }
        onNodeMouseLeave={() => !selectedNode && resetNodeStyles()}
        onNodesChange={onNodesChange}
        onPaneClick={() => {
          setSelectedNode(undefined)
          resetNodeStyles()
        }}
      >
        <Controls position="top-right" showInteractive={false} />
      </ReactFlow>
    </ReactFlowContainer>
  )
}

const ModelGraph: React.FC = () => {
  return (
    <ReactFlowProvider>
      <ModelFlow />
    </ReactFlowProvider>
  )
}

export default ModelGraph
