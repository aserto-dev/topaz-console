import { highlight, languages } from 'prismjs'
import React from 'react'

import { StyledCodeEditor } from './styles'
const CodeEditor: React.FC<{
  hasError?: boolean
  language?: string
  readOnly?: boolean
  value: string
  onValueChange?: (value: string) => void
}> = ({
  hasError = false,
  readOnly = true,
  value,
  language,
  onValueChange = () => {},
}) => {
  return (
    <>
      <StyledCodeEditor
        $hasError={hasError}
        disabled={readOnly}
        highlight={(value: string) =>
          highlight(value, languages[language || 'json'], language || 'json')
        }
        ignoreTabKey={false}
        padding="10px"
        preClassName="styledpre"
        readOnly={readOnly}
        value={value || ''}
        onValueChange={onValueChange}
      />
    </>
  )
}

export default CodeEditor
