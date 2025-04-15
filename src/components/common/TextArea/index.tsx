import './TextArea.css'

import React from 'react'
import { FormControl, FormControlProps } from 'react-bootstrap'

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  onChange?: FormControlProps['onChange']
  style?: unknown
  value: number | string
}

const TextArea: React.FC<TextAreaProps> = ({
  onChange,
  style,
  value,
  ...props
}) => (
  <FormControl
    as="textarea"
    style={style}
    value={value}
    onChange={onChange}
    {...props}
  />
)
export default TextArea
