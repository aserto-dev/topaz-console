import { Modal } from 'react-bootstrap'
import styled from 'styled-components'

import { theme } from '../../theme'

export const TabContainer = styled.ul`
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #414141;
  list-style-type: none;
  padding: 0;
`

interface TabProps {
  checked: boolean
}
export const Tab = styled.li<TabProps>`
  cursor: pointer;
  padding: 20px 0 20px 5px;
  width: 111px;
  border-bottom: 1px solid ${({ checked }) => (checked ? `#ff4a4a` : `#414141`)};
  color: ${({ checked }) => (checked ? `#e7e7e7` : `#a0a0a0`)};
`

export const CardModalContainer = styled(Modal)`
  overflow-x: hidden;
  border-radius: 20px;
  .modal-content {
    border-radius: 20px;
  }
`

export const CardContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  strong {
    color: ${theme.grey100};
  }
  img {
    align-self: baseline;
    margin-right: 14px;
    width: 120px;
  }
  flex-basis: 100%;
  width: 100%;
`
export const BodyContainer = styled.div`
  flex-basis: 100%;
`

export const SadAxoLotl = styled.div`
  display: flex;
`

export const MessageContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  margin-left: 134px;
  width: 80%;
  height: 332px;
  overflow-y: scroll;
`

export const ButtonContainer = styled.div`
  button {
    float: right;
    margin-left: 10px;
    margin-bottom: 10px;
  }
`

export const MessageText = styled.span`
  margin-bottom: 15px;
  a {
    color: ${theme.indogoAccent4};
  }
  word-break: break-word;
  white-space: pre-wrap;
`
