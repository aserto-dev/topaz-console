import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'

import { theme } from '../../../theme'
import Label from '../../common/Label'

const CheckboxContainer = styled.div`
  display: flex;
  vertical-align: middle;
`

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  display: block;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  width: 1px;
`

const Icon = styled.svg`
  fill: none;
  stroke: ${theme.fullWhite};
  stroke-width: 2px;
`

const StyledCheckbox = styled.div<{
  $disabled?: boolean
  $hasLabel: boolean
  checked: boolean
}>`
  display: inline-block;
  border: 1px solid ${(props) => (props.checked ? theme.primary : theme.grey50)};
  ${({ $hasLabel: hasLabel }) => (hasLabel ? 'margin-right: 10px;' : '')}
  width: 16px;
  height: 16px;
  background: ${(props) => (props.checked ? theme.primary : 'transparent')};
  display: flex;
  transition: all 150ms;
  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px ${theme.grey40};
  }
  ${({ $disabled }) =>
    $disabled
      ? css`
          pointer-events: none;
          background-color: ${theme.grey10};
          border-color: ${theme.grey30};
          svg {
            stroke: ${theme.grey40};
          }
        `
      : ''};
`

const HorizontalLabel = styled(Label)`
  display: flex;
  margin-bottom: 0px;
  align-items: center;
`

interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange' | 'type'> {
  disabled?: boolean
  label?: string
  onChange?: (checked: boolean) => void
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  className,
  disabled,
  label,
  onChange,
  ...checkboxProps
}) => {
  const onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((event) => onChange?.(event.target.checked), [onChange])

  return (
    <CheckboxContainer>
      <HorizontalLabel $small>
        <HiddenCheckbox
          checked={checked}
          disabled={disabled}
          onChange={onCheckboxChange}
          {...checkboxProps}
        />
        <StyledCheckbox
          $disabled={disabled}
          $hasLabel={!!label}
          checked={checked === undefined ? false : checked}
          className={className}
        >
          {checked && (
            <Icon viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </Icon>
          )}
        </StyledCheckbox>
        {label}
      </HorizontalLabel>
    </CheckboxContainer>
  )
}

export default Checkbox
