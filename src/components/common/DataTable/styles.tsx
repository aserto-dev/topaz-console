import styled from 'styled-components'

import { theme } from '../../../theme'

export const TableContainer = styled.div<{
  $breakTopDistance?: number
  $topDistance?: number
}>`
  ${({ $topDistance }) => `height: calc(100vh - ${$topDistance || 244}px)`};
  position: relative;
  .tableWrap {
    border-bottom: 1px solid black;
  }
  overflow-x: hidden;
  width: 100%;
  @media (max-width: 912px) {
    ${({ $breakTopDistance }) =>
      `height: calc(100vh - ${$breakTopDistance || 318}px)`};
  }
`

export const StyledTable = styled.table`
  width: 98%;
  margin-left: auto;
  margin-right: auto;

  thead {
    th {
      min-width: 120px;
      vertical-align: top;
      padding: 20px;
    }
    tr {
      color: ${theme.grey100};
      font-weight: bold;
      font-size: 16px;
    }
  }
  tbody {
    font-size: 14px;
    transition:
      visibility 700ms ease,
      opacity 500ms ease;
    tr {
      color: ${theme.grey70};
      box-shadow: inset 0px 0px 0px 1px ${theme.grey20};
      td {
        padding: 20px;
      }
    }
  }
`
