import styled from 'styled-components'

import { theme } from '../../../theme'

const InfoText = styled.div`
  font-size: 14px;
  color: ${theme.grey70};
  margin-top: 8px;
  @media (max-width: 720px) {
    max-width: 270px;
  }
`

export default InfoText
