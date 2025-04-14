import { Button as BootstrapButton } from 'react-bootstrap'
import styled, { css } from 'styled-components'

import { theme } from '../../../theme'

const BaseButton = styled(BootstrapButton)<{ size?: 'sm' | 'md' | 'lg' }>`
  border: none;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  font-weight: 400;
  font-family: 'Roboto', 'Open Sans', sans-serif;
  ${({ size }) => {
    if (size === 'sm') {
      return css`
        font-size: 12px;
      `
    } else if (size === 'lg') {
      return css`
        height: 48px;
        font-size: 1.25rem;
      `
    }
    return css`
      height: 36px;
    `
  }}
  &:disabled {
    background-color: ${theme.grey40};
  }
`

export const PrimaryButton = styled(BaseButton)`
  background-color: ${theme.indogo60};
  color: ${theme.fullWhite};
  &:hover:not(:disabled),
  &:visited,
  &:focus {
    background-color: ${theme.indogo90};
    box-shadow: none !important;
  }
  &:active:enabled {
    background-color: ${theme.primary} !important;
  }
  &:disabled {
    img {
      filter: brightness(50%);
    }
    background-color: ${theme.indogo30};
    color: ${theme.grey70};
  }
`

export const SecondaryButton = styled(BaseButton)`
  color: ${theme.grey100};
  background-color: ${theme.grey20};
  border: 1px solid ${theme.grey30};
  &:hover:not(:disabled),
  &:visited,
  &:focus {
    border: 1px solid ${theme.grey40} !important;
    outline: none;
    box-shadow: none !important;
    background-color: ${theme.grey40};
  }
  &:disabled {
    background-color: ${theme.grey10};
    border-color: ${theme.grey10};
    color: ${theme.grey40};
  }
  &:active {
    border: 1px solid ${theme.grey40} !important;
    background-color: ${theme.grey40} !important;
  }
`

export const DangerButton = styled(BaseButton)`
  color: ${theme.fullWhite};
  background-color: ${theme.mojo50};
  &:hover:not(:disabled) {
    background-color: ${theme.mojo60};
  }
  &:visited,
  &:focus {
    box-shadow: none !important;
    background-color: ${theme.mojo80} !important;
  }
  &:disabled {
    background-color: ${theme.mojo20};
    color: ${theme.grey50};
  }
  &:active {
    background-color: ${theme.grey80} !important;
  }
`

export const SecondaryBorderlessButton = styled(BaseButton)`
  height: 100%;
  border: none !important;
  color: ${theme.grey100};
  background-color: transparent;
  outline: none;
  box-shadow: none !important;
  &:hover:not(:disabled),
  &:visited,
  &:focus {
    outline: none;
    background-color: ${theme.grey40};
  }
  &:disabled {
    background-color: ${theme.grey10};
    color: ${theme.grey40};
  }
  &:active {
    background-color: ${theme.grey40} !important;
  }
`
export const PrimaryOutline = styled(BaseButton)`
  border: 1px solid ${theme.indogo60};
  font-weight: 400;
  background-color: ${theme.primaryBlack};
  &:hover:not(:disabled),
  &:visited,
  &:focus {
    border: 1px solid ${theme.indogo90};
    background-color: ${theme.grey40};
    box-shadow: none !important;
  }
  &:active {
    background-color: ${theme.grey40} !important;
  }
  &:disabled {
    background-color: ${theme.grey10};
    border: 1px solid ${theme.primary};
    color: ${theme.grey70};
  }
`
