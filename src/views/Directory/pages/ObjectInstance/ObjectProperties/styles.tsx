import styled from 'styled-components'

import { theme } from '../../../../../theme'

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`
export const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
`

export const ErrorMessage = styled.span`
  color: ${theme.mojoAccent3};
`

export const PropertiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  margin: 20px;
`
