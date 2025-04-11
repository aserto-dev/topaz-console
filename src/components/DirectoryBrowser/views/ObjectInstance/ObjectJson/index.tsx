import copy from 'copy-to-clipboard'
import React, { useState } from 'react'

import CodeEditor from '../../../../../components/common/CodeEditor'
import { V3Object } from '../../../../../types/directory'
import { CopiedToClipboard, CopyContainer, CopyJsonButton, PropertiesContainer } from './styles'

const ObjectJson: React.FC<{ object?: V3Object }> = ({ object }) => {
  const [isCopied, setIsCopied] = useState(false)

  return (
    <PropertiesContainer>
      <CopyContainer>
        <CopyJsonButton
          variant="secondary"
          onClick={() => {
            copy(JSON.stringify(object, null, 2))
            setIsCopied(true)
            setTimeout(() => {
              setIsCopied(false)
            }, 1000)
          }}
        >
          Copy
        </CopyJsonButton>
        {isCopied ? <CopiedToClipboard>Copied to clipboard</CopiedToClipboard> : null}
      </CopyContainer>
      <CodeEditor value={JSON.stringify(object, null, 2)} />
    </PropertiesContainer>
  )
}

export default ObjectJson
