import React from 'react'
import { ButtonProps as BootstrapButtonProps } from 'react-bootstrap'

import {
  DangerButton,
  PrimaryButton,
  PrimaryOutline,
  SecondaryBorderlessButton,
  SecondaryButton,
} from './styles'

interface ButtonProps extends BootstrapButtonProps {
  variant?: Variant
}

type Variant =
  | 'danger'
  | 'primary'
  | 'primary-outline'
  | 'secondary'
  | 'secondary-borderless'

const getButtonFromVariant = (variant: Variant) => {
  const variantObj = {
    danger: DangerButton,
    primary: PrimaryButton,
    'primary-outline': PrimaryOutline,
    secondary: SecondaryButton,
    'secondary-borderless': SecondaryBorderlessButton,
  }
  return variantObj[variant] || variantObj.primary
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', ...props }, ref) => {
    const ButtonComponent = getButtonFromVariant(variant)
    return <ButtonComponent ref={ref} {...props} />
  },
)

export default Button
