import { FC, memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from 'reactflow'
import styled from 'styled-components'

import { theme } from '../../../../../theme'

const LabelDiv = styled.div<{ transform: string; highlight?: boolean }>`
  position: absolute;
  background: transparent;
  color: ${({ highlight }) => (highlight ? theme.grey100 : theme.grey50)};
  font-size: 13px;
  font-weight: 400;
  transform: ${({ transform }) => transform};
  &:hover {
    color: ${({ highlight }) => (highlight ? theme.grey100 : theme.grey50)};
  }
`

const EdgeLabel = ({
  transform,
  label,
  highlight,
}: {
  transform: string
  label: string
  highlight?: boolean
}) => {
  return (
    <LabelDiv highlight={highlight} transform={transform}>
      {label}
    </LabelDiv>
  )
}

const CustomEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        id={id}
        interactionWidth={20}
        markerEnd={markerEnd}
        path={edgePath}
        style={{
          strokeWidth: data.subjectRelation ? 2 : 1,
          stroke: theme.grey50,
          strokeDasharray: data.subjectRelation && '5,5',
          ...style,
        }}
      />
      <EdgeLabelRenderer>
        {data.startLabel && (
          <EdgeLabel
            highlight={data.subjectRelation?.highlight}
            label={data.startLabel}
            transform={`translate(15%, -75%) translate(${sourceX}px,${sourceY}px)`}
          />
        )}
        {data.endLabel && (
          <EdgeLabel
            highlight={data.subjectRelation?.highlight}
            label={data.endLabel}
            transform={`translate(-120%, -75%) translate(${targetX}px,${targetY}px)`}
          />
        )}
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(CustomEdge)
