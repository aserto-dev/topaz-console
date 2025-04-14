import React, { ReactElement } from 'react'
import styled, { css } from 'styled-components'

import { theme } from '../../../theme'

const TabContainer = styled.div`
  width: 100%;
  display: flex;
  position: fixed;
  max-width: 250px;
  flex-direction: column;
  height: 100%;
  border: 1px solid ${theme.grey20};
  &:last-child {
    border-bottom: none;
  }
`

const TabItem = styled.div<{ selected?: boolean; disabled?: boolean }>`
  padding: 12px 20px;
  ${({ disabled }) => {
    return disabled
      ? css`
          background-color: ${theme.grey10};
          border-bottom: 1px solid ${theme.grey10};
          color: ${theme.grey40};
          pointer-events: none;
        `
      : css`
          cursor: pointer;
          background-color: ${theme.primaryBlack};
          border-bottom: 1px solid ${theme.grey20};
          color: ${theme.grey70};
        `
  }}

  &:hover {
    color: ${theme.grey100};
    background-color: ${theme.grey10};
  }
  ${({ selected }) => {
    return selected
      ? css`
          border-left: 5px solid ${theme.indogoAccent3};
          background-color: ${theme.grey10};
          color: ${theme.grey100};
        `
      : css`
          border-left: 5px solid ${theme.primaryBlack};
        `
  }}
`

const ComingSoonText = styled.span`
  color: ${theme.grey70};
  font-size: 11px;
`

export type TabOption = {
  label: string
  value: string
  isDisabled?: boolean
  hidden?: boolean
}

export type VerticalTabProps = {
  options: Array<TabOption>
  selectedValue?: string
  onChange: (value: string) => void
  title?: string
  addVerticalTabButton?: ReactElement
}

export const VerticalTab: React.FC<VerticalTabProps> = ({
  options,
  selectedValue,
  onChange,
  title,
  addVerticalTabButton,
}) => {
  return (
    <>
      <TabContainer>
        {title && (
          <TabItem>
            <h6>{title}</h6>
          </TabItem>
        )}
        {options.map((option) => {
          return (
            <TabItem
              key={option.value}
              data-testid={option.value}
              disabled={option.isDisabled}
              hidden={option.hidden}
              selected={selectedValue === option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
              {option.isDisabled && (
                <ComingSoonText>&nbsp;(not available)</ComingSoonText>
              )}
            </TabItem>
          )
        })}
        {addVerticalTabButton}
      </TabContainer>
    </>
  )
}
