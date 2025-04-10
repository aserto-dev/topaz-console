import { createGlobalStyle } from 'styled-components'

import { theme } from './theme'

export const GlobalStyle = createGlobalStyle`
  #root,
  #app {
    height: 100%;
  }
  html,
  body {
    height: 100%;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${theme.primaryBlack};
    color: ${theme.grey70};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${theme.grey100};
  }

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: ${theme.grey10};
  }

  &::-webkit-scrollbar-corner {
    background-color: ${theme.grey10};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.grey40};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    margin: 4px;
    border-radius: 10px;
  }

  code {
    font-family: 'Ubuntu Mono', source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    color: ${theme.lochivarAccent4};
  }

  /* link treatment */
  a {
    color: ${theme.lochivarAccent4};
  }
  a:hover {
    text-decoration: underline;
    color: ${theme.lochivarAccent3}
  }

  textarea {
    resize: none;
  }

  :root {
    --focus-border: ${theme.primary};
    --separator-border: ${theme.grey30};
  }

  .allotment-module_splitView__L-yRc.allotment-module_separatorBorder__x-rDS
    > .allotment-module_splitViewContainer__rQnVa
    > .allotment-module_splitViewView__MGZ6O:not(:first-child)::before {
    background-color: var(--separator-border);
    content: ' ';
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    z-index: 0;
  }

  .monaco-editor .vertical {
    z-index: 0 !important;
  }

  .modal-content {
    background-color: ${theme.grey20};
    color: ${theme.grey100};
  }

  @media (min-width: 800px) {
    .left-item:after {
      content: "";
      background: ${theme.grey30};
      position: absolute;
      bottom: 16px;
      height: 50%;
      right: 206px;
      width: 1px;
    }
  }

  .overflow-y-hidden {
    overflow-y: hidden;
 }
`
