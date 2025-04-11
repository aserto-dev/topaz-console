import React, { useMemo } from 'react'
import copy from 'copy-to-clipboard'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import copyIcon from '../../../../src/assets/copy.svg'
import { CodeContainer, CodeDiv, CopyButton, customAtomDark } from './styles'

type HighlightProps = {
  children: string
  language: string
  copyToClipboard?: boolean
  height?: number
}

const Highlight: React.FC<HighlightProps> = ({
  children,
  language,
  copyToClipboard,
  height,
}) => {
  const memoizedHighlighter = useMemo(
    () => (
      <SyntaxHighlighter
        language={language}
        lineProps={{ style: { whiteSpace: 'break-spaces' } }}
        style={customAtomDark}
        wrapLines={true}
      >
        {children}
      </SyntaxHighlighter>
    ),
    [children, language],
  )
  return (
    <CodeContainer $copyToClipboard={copyToClipboard}>
      <CodeDiv $height={height}>{memoizedHighlighter}</CodeDiv>
      {copyToClipboard && (
        <CopyButton
          onClick={() => {
            copy(children)
          }}
        >
          <img alt="copy" src={copyIcon} />
        </CopyButton>
      )}
    </CodeContainer>
  )
}

export default Highlight
