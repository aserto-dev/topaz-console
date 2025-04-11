import { Edge, Node, MarkerType } from 'reactflow'
import { theme } from '../../../../../../theme'

export type GraphData = {
  nodes: Node[]
  edges: Edge[]
}

export const markerEnd = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: theme.grey60,
}
