import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styled from 'styled-components'

import { theme } from '../../../theme'

export const customAtomDark: { [key: string]: React.CSSProperties } = {
  ...atomDark,
  ':not(pre) > code[class*="language-"]': {
    background: 'inherit',
  },
  'pre[class*="language-"]': {
    background: 'inherit',
    fontFamily: '"Fira Code", monospace',
    fontSize: '14px',
    fontWeight: '500',
  },
}

export const CodeContainer = styled.div<{ $copyToClipboard?: boolean }>`
  background: ${({ $copyToClipboard }) => ($copyToClipboard ? theme.grey10 : theme.primaryBlack)};
  border-radius: 4px;
  display: flex;
  flex-direction: row;
`

export const CodeDiv = styled.div<{ $height?: number }>`
  padding: 10px 0px 0px 10px;
  height: ${({ $height }) => $height}px;
`

export const CopyButton = styled.button`
  background: ${theme.grey10};
  border-radius: 4px;
  border: 0px;
  height: fit-content;
  margin-left: auto;
  margin-right: 2px;
  margin-top: 2px;
  &:hover {
    background: ${theme.grey40};
  }
  &:active {
    box-shadow: 0 5px ${theme.grey20};
    transform: translateY(4px);
  }
`
