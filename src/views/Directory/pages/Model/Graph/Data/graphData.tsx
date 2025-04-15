import { Edge, MarkerType, Node } from 'reactflow'

import { theme } from '../../../../../../theme'

export type GraphData = {
  edges: Edge[]
  nodes: Node[]
}

export const markerEnd = {
  color: theme.grey60,
  height: 20,
  type: MarkerType.ArrowClosed,
  width: 20,
}
