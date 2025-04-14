import styled from 'styled-components'

import Button from '../../../../../components/common/Button'

export const StyledEditor = styled.div`
  height: 100vh;
`

export const SaveButton = styled(Button)`
  width: 136px;
`

export const ButtonsContainer = styled.div`
  vertical-align: middle;
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
`
export const Image = styled.img`
  margin-bottom: 1px;
`
export const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
`

export const PropertiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  margin: 20px;
`
