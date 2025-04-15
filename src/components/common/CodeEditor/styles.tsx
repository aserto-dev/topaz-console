import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prism-themes/themes/prism-atom-dark.css'
import Editor from 'react-simple-code-editor'
import styled from 'styled-components'

import { theme } from '../../../theme'

export const StyledCodeEditor = styled(Editor)<{
  $hasError?: boolean
  $readOnly?: boolean
}>`
  background-color: ${theme.primaryBlack};
  border-color: ${({ $hasError }) =>
    $hasError ? theme.mojoAccent3 : theme.grey40};
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  color: ${theme.grey100};
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  font-weight: 400;
  max-width: 100%;
  min-width: 200px;
  width: max-content;
  &:focus-within {
    background-color: ${theme.primaryBlack};
    color: ${theme.grey100};
    box-shadow: none;
    border-color: ${({ $hasError }) =>
      $hasError ? theme.mojoAccent3 : theme.indogoAccent2};
    -webkit-box-shadow: none;
  }
  &:disabled {
    background-color: ${theme.grey20};
    border-color: ${theme.grey20};
    -webkit-text-fill-color: ${theme.grey70};
  }
  .styledpre {
    color: ${theme.mojoAccent3};
    min-height: 100px;
    height: auto;
  }
  textarea:focus {
    outline: none;
  }
`
