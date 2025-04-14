import './TextArea.css'

import React from 'react'
import { FormControl, FormControlProps } from 'react-bootstrap'

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  value: string | number
  onChange?: FormControlProps['onChange']
  style?: unknown
}

const TextArea: React.FC<TextAreaProps> = ({ value, onChange, style, ...props }) => (
  <FormControl as="textarea" style={style} value={value} onChange={onChange} {...props} />
)
export default TextArea
