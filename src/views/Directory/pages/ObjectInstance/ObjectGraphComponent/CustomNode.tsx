import { FC, memo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import styled from 'styled-components'

import Button from '../../../../../components/common/Button'
import { theme } from '../../../../../theme'

const NodeDiv = styled.div`
  width: 200px;
  height: 76px;
  padding: 8px;
  background-color: ${theme.grey20};
  border: 1px solid ${theme.grey30};
  border-radius: 4px;
  color: ${theme.grey100};
  .react-flow__handle {
    border: 1px solid ${theme.grey30};
    background: ${theme.grey30};
    width: 1px;
    height: 14px;
    border-radius: 1px;
  }
`

const NodeLabel = styled.div`
  margin-bottom: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 600;
`

const ObjectTypeButton = styled.span<{ color: string }>`
  border: 1px solid ${({ color }) => color};
  color: ${({ color }) => color};
  border-radius: 4px;
  padding: 3px 8px 6px;
  font-size: 14px;
  font-weight: 400;
  &:hover {
    filter: brightness(130%);
  }
  span {
    color: ${theme.grey100};
    font-weight: 600;
  }
`

export const Filter = styled(Button)<{ node: string }>`
  background-color: ${theme.grey40};
  color: ${theme.grey100};
  margin-left: 8px;
  font-size: 14px;
  font-weight: 400;
  padding: 0px 4px 0px 8px;
  height: 27px;
  line-height: 14px;
  border-radius: 2px 0px 0px 2px;
  pointer-events: none;
  &:hover:not(:disabled),
  &:visited,
  &:focus {
    background-color: ${theme.grey40};
  }
`

export const ResetFilter = styled(Button)`
  background-color: ${theme.grey40};
  color: ${theme.grey100};
  font-size: 14px;
  font-weight: 400;
  padding: 0px 8px;
  height: 27px;
  line-height: 14px;
  margin-right: 36px;
  border-radius: 0px 2px 2px 0px;
  &:hover:not(:disabled),
  &:visited,
  &:focus {
    background-color: ${theme.mojoAccent3};
  }
`

export const FilterSpan = styled.span`
  font-size: 14px;
  color: ${theme.grey100};
`

const CustomNode: FC<NodeProps> = ({ data }) => {
  return (
    <>
      <NodeDiv>
        {!!data.targetHandle && (
          <Handle position={Position.Left} type="target" />
        )}
        <NodeLabel>{data.label}</NodeLabel>
        <ObjectTypeButton
          color={data.color}
          onClick={(e) => {
            e.stopPropagation()
            data.onObjectTypeClick({ objectType: data.objectType.value })
          }}
        >
          {data.objectType.name}
          {data.subjectRelationLabel && (
            <span>{data.subjectRelationLabel}</span>
          )}
        </ObjectTypeButton>
        {!!data.sourceHandle && (
          <Handle position={Position.Right} type="source" />
        )}
      </NodeDiv>
    </>
  )
}

export default memo(CustomNode)
