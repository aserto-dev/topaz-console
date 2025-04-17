import styled from 'styled-components'

import Input from '../../../../components/common/Input'
import { theme } from '../../../../theme'

export const DataContainer = styled.div`
  padding-left: 12px;
  width: 100%;
`

export const SelectContainer = styled.div`
  display: inline-flex;
  z-index: 1;
  position: fixed;
  width: calc(98% - 222px);
  padding-top: 8px;
  background-color: ${theme.primaryBlack};
  @media (max-width: 912px) {
    width: calc(98% + 12px);
    padding-top: 12px;
  }
`

export const ObjectContainer = styled.div`
  width: 100%;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
  padding-right: 16px;
`

export const SubjectContainer = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 32px;
  width: 100%;
  padding-left: 16px;
  @media (max-width: 912px) {
    padding-right: 12px;
  }
`

export const FieldsContainer = styled.div`
  padding-top: 12px;
  gap: 16px;
  display: inline-flex;
  width: 100%;
`

export const ObjectTypeContainer = styled.div`
  width: 100%;
`

export const ObjectIdContainer = styled.div`
  width: 100%;
}
`
export const RelationsContainer = styled.div`
  width: 100%;
`
export const SubjectTypeContainer = styled.div`
  width: 100%;
`

export const SubjectIdContainer = styled.div`
  width: 100%;
`

export const SubjectRelationContainer = styled.div`
  width: 100%;
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
  thead {
    height: 0;
  }
  tbody tr {
    border: none;
  }
  tbody tr td {
    padding: 8px;
  }
  tbody tr td:nth-child(4) {
    border-right: 2px solid ${theme.grey20};
  }
`

export const EmptyTableContainer = styled.div`
  margin-top: 200px;
`
