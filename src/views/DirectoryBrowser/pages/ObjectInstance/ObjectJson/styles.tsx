import styled from 'styled-components'

import { CopyButton } from '../../../../../components/common/Input'
import { theme } from '../../../../../theme'

export const CopyJsonButton = styled(CopyButton)`
  align-self: flex-start;
`

export const PropertiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: space-between;
  margin: 20px;
`
export const CopiedToClipboard = styled.div`
  color: ${theme.grey70};
  padding: 5px;
`
export const CopyContainer = styled.div`
  display: flex;
`
