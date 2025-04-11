import styled from 'styled-components'

import { ObjectHeaderContainer } from '../../../styles'

export const Header = styled(ObjectHeaderContainer)`
  flex-direction: column;
  justify-content: space-evenly;
  align-items: inherit;
  font-weight: bold;
`

export const SubHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
`

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-driection: row;
`
