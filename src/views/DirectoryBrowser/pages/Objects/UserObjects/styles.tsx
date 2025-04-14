import styled from 'styled-components'

import Input from '../../../../../components/common/Input'
import { theme } from '../../../../../theme'
import Button from '../../../../../components/common/Button'

export const Container = styled.div`
  width: 100%;
  @media (max-width: 912px) {
    margin-top: 94px;
  }
`

export const PageHeaderInput = styled(Input)`
  max-width: 330px;
  width: 330px;
`

export const PageHeaderInputFind = styled(Input)`
  max-width: 330px;
  width: 330px;
  border-radius: 4px 0 0 4px;
`

export const UsersContainer = styled.div`
  width: 100%;
  margin-bottom: 25px;
  padding: 0px 25px;
`

export const SubjectCard = styled.div<{ $inline?: boolean }>`
  background-color: ${theme.grey20};
  color: ${theme.grey70};
  display: ${({ $inline }) => ($inline ? 'inline-flex' : 'flex')};
  width: 450px;
  padding: 10px;
  margin: 10px 10px 0 0;
  border-radius: 6px;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  > div {
    flex-direction: column;
    display: flex;
    gap: 3px;
  }
  img {
    margin-right: 10px;
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 50%;
  }
  &:hover {
    background-color: ${theme.grey30};
    color: ${theme.grey100};
  }
`

export const BoldSpan = styled.span`
  font-weight: bold;
  color: ${theme.grey100};
`

export const EllipsisDiv = styled.div`
  display: block;
  width: 315px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const FindButton = styled(Button)`
  height: 36px;
`
