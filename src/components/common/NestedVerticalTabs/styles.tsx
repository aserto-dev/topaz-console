import { NavLink } from 'react-router'
import styled, { css } from 'styled-components'

import { theme } from '../../../theme'

export const TabContainer = styled.div`
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

export const TabSectionOptions = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? 'block' : 'none')};
`
export const VerticalTab = styled(NavLink)<{ $depth: number }>`
  align-items: center;
  color: ${theme.grey70};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-weight: 400;
  gap: 8px;
  padding: 6px 25px;
  text-decoration: none;
  &:hover {
    text-decoration: none;
    color: ${theme.grey100};
    background-color: ${theme.grey10};
  }
  > img {
    visibility: hidden;
  }

  &.active {
    color: ${theme.grey100};
    > img {
      visibility: visible;
    }
  }

  ${({ $depth }) => {
    return $depth === 0
      ? css`
          border-bottom: 1px solid ${theme.grey20};
          padding: 8px 0px;
          color: ${theme.grey70};
          :nth-child(odd) {
            margin-top: -1px;
          }
          &.active {
            color: ${theme.grey100};
            background-color: ${theme.grey20};
            border-left: 5px solid ${theme.indogoAccent3};
          }
        `
      : undefined
  }}
`

export const AddTypeButton = styled.div`
  color: ${theme.grey70};
  cursor: pointer;
  display: flex;
  padding: 6px 42px;
  margin-bottom: 10px;
  span {
    border-bottom: 2px dotted ${theme.grey70};
  }
  &:hover {
    color: ${theme.grey100};
  }
`
