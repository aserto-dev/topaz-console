import styled from 'styled-components'

import Button from '../../../../components/common/Button'
import { theme } from '../../../../theme'

export const AddButton = styled(Button)`
  align-self: flex-start;
  display: flex;
  align-items: center;
`

export const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 10px;
`

export const DataRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding-left: 10px;
`

export const DataLabel = styled.span`
  font-weight: bold;
  font-size: 14px;
  color: ${theme.grey100};
  white-space: nowrap;
`

export const DataValue = styled.span`
  font-weight: 100;
  font-size: 16px;
  color: ${theme.grey70};
  word-break: break-all;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Roboto';
`

export const ObjectContainer = styled.div`
  margin-left: 10px;
  display: flex;
  color: ${theme.grey100};
  font-size: 16px;
  min-height: 50px;
`

export const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const RelationTypesTableContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 33%;
  align-self: start;
  margin: 20px 0px 0px 12px;
  border-bottom: 1px solid ${theme.primaryBlack};
  div {
    overflow-x: hidden;
  }
`

export const RelationsContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-self: start;
  margin: 20px 0px 0px 20px;
  border-bottom: 1px solid ${theme.primaryBlack};
  overflow: auto;
  height: calc(100vh - 384px);
`

export const RelationCardsContainer = styled.div``

export const ContentContainer = styled.div`
  display: flex;
`

export const FullContainer = styled.div`
  width: 100%;
`

export const NoRelationText = styled.p`
  margin: 20px 0;
`

export const HighlightedContainer = styled.div`
  display: flex;
  background-color: ${theme.grey20};
  width: 100%;
  min-height: 60px;
  padding: 20px;
  align-items: center;
  font-family: 'Roboto';
  color: ${theme.grey100};
`

export const RelationCard = styled.div`
  background-color: ${theme.grey20};
  color: ${theme.grey70};
  display: inline-flex;
  width: 400px;
  height: 100px;
  padding: 15px;
  margin: 10px 10px 0 0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  > div {
    flex-direction: column;
    align-items: flex-start
    display: flex;
  }
  .left-auto {
    margin-left: auto;
  }
  &:hover {
    background-color: ${theme.grey30};
    color: ${theme.grey100};
  }
`

export const BoldSpan = styled.span`
  font-weight: bold;
  color: ${theme.grey100};
  word-break: break-all;
`

export const EllipsisDiv = styled.div`
  display: block;
  width: 325px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const CardDetails = styled.div`
  margin-top: 12px;
`
