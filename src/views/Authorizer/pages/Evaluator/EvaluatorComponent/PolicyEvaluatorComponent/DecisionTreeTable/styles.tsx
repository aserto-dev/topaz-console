import styled from 'styled-components'

export const DecisionTreeTableWrapper = styled.div`
  margin-top: 32px;
  min-height: 252px;
  height: calc(100vh - 642px);
`

export const Cell = styled.div`
  min-width: 180px;
  height: 100%;
  display: flex;
  align-items: flex-start;
`

export const ModuleCell = styled.div`
  box-sizing: border-box;
  display: block;
  overflow: hidden;
  word-break: break-all;
  max-width: 20vw;
`

export const CodeCell = styled.div`
  box-sizing: border-box;
  display: block;
  font-weight: 400;
  overflow-x: scroll;
  word-break: break-all;
  ::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  min-width: 80px;
`
export const CellOverflow = styled.div`
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2em;
`
