import styled from 'styled-components'

import Input from '../../../../components/common/Input'
import { theme } from '../../../../theme'

export const DataContainer = styled.div`
  padding-left: 12px;
  width: 100%;
`

export const ObjectTypeContainer = styled.td`
  width: 100%;
  margin: 8px;
  margin-left: 0px;
`
export const ObjectIdContainer = styled.td`
  width: 100%;
  margin: 8px;
`
export const RelationsContainer = styled.td`
  width: 100%;
  margin: 8px;
`
export const SubjectTypeContainer = styled(ObjectIdContainer)``
export const SubjectIdContainer = styled(ObjectIdContainer)``
export const SubjectRelationContainer = styled.td`
  width: 100%;
  margin: 8px;
  margin-right: 0px;
`

export const BreakDiv = styled.div`
  word-break: break-all;
`

export const FilterInput = styled(Input)`
  flex-grow: 1;
  font-size: 14px;
  height: 36px;
  &:disabled {
    background-color: ${theme.grey10};
  }
`

export const TableWrapper = styled.div`
  table {
    width: 100%;
  }

  tbody tr {
    border: none;
  }
  tbody tr td {
    padding: 8px;
  }
  tbody tr td:nth-child(3) {
    border-right: 2px solid ${theme.grey20};
    margin-left: 4px;
  }
  tbody tr td:nth-child(4) {
    margin-left: 4px;
  }
`

export const EmptyTableContainer = styled.div`
  margin-top: 200px;
`
