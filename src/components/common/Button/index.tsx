import React from 'react'
import { ButtonProps as BootstrapButtonProps } from 'react-bootstrap'

import {
  DangerButton,
  PrimaryButton,
  PrimaryOutline,
  SecondaryBorderlessButton,
  SecondaryButton,
} from './styles'

type DisplayState = {
  visible?: boolean
  enabled?: boolean
}

type Variant = 'primary' | 'secondary' | 'danger' | 'secondary-borderless' | 'primary-outline'

export interface ButtonProps extends BootstrapButtonProps {
  variant?: Variant
  displayState?: DisplayState
}

const getButtonFromVariant = (variant: Variant) => {
  const variantObj = {
    primary: PrimaryButton,
    secondary: SecondaryButton,
    danger: DangerButton,
    'secondary-borderless': SecondaryBorderlessButton,
    'primary-outline': PrimaryOutline,
  }
  return variantObj[variant] || variantObj.primary
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', displayState, ...props }, ref) => {
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
  }
)
export default Button
