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
  displayState?: DisplayState
  variant?: Variant
}

type DisplayState = {
  enabled?: boolean
  visible?: boolean
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
  ({ displayState, variant = 'primary', ...props }, ref) => {
    const ButtonComponent = getButtonFromVariant(variant)
    if (!displayState) {
      return <ButtonComponent ref={ref} {...props} />
    }
    if (displayState.visible) {
      if (displayState.enabled) {
        return <ButtonComponent ref={ref} {...props} />
      }
      return <ButtonComponent ref={ref} disabled {...props} />
    }

    return null
  },
)
export default Button
