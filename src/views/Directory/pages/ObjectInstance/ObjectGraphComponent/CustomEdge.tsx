import { FC, memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from 'reactflow'
import styled from 'styled-components'

import { theme } from '../../../../../theme'

const LabelDiv = styled.div<{ highlight?: boolean; transform: string; }>`
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
  highlight,
  label,
  transform,
}: {
  highlight?: boolean
  label: string
  transform: string
}) => {
  return (
    <LabelDiv highlight={highlight} transform={transform}>
      {label}
    </LabelDiv>
  )
}

const CustomEdge: FC<EdgeProps> = ({
  data,
  id,
  markerEnd,
  sourcePosition,
  sourceX,
  sourceY,
  style = {},
  targetPosition,
  targetX,
  targetY,
}) => {
  const [edgePath] = getBezierPath({
    sourcePosition,
    sourceX,
    sourceY,
    targetPosition,
    targetX,
    targetY,
  })

  return (
    <>
      <BaseEdge
        id={id}
        interactionWidth={20}
        markerEnd={markerEnd}
        path={edgePath}
        style={{
          stroke: theme.grey50,
          strokeDasharray: data.subjectRelation && '5,5',
          strokeWidth: data.subjectRelation ? 2 : 1,
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
