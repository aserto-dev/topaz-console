import React, { useEffect, useState } from 'react'
import { FormControl, FormControlProps } from 'react-bootstrap'
import styled, { css, keyframes } from 'styled-components'

import search from '../../../assets/search.svg'
import { theme } from '../../../theme'
import Button from '../Button'
import ErrorText from '../ErrorText'
import InfoText from '../InfoText'
import Label from '../Label'
import copy from './copy.svg'
import hide from './hide.svg'
import invalid from './invalid.svg'
import show from './show.svg'
import unavailable from './unavailable.svg'
import valid from './valid.svg'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onChange?: FormControlProps['onChange']
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>
  label?: string
  info?: string
  hideError?: boolean
  error?: string | boolean
  isValid?: boolean
  isUnavailable?: boolean
  style?: React.CSSProperties
  hasSmallLabel?: boolean
  autoComplete?: string
  block?: boolean
  defaultValue?: string | number
  id?: string
  onClickCopy?: (value: string) => void
  onClickSearch?: () => void

  shouldShowHideShowButton?: boolean
}

const getInputValueForState = (
  isValid: boolean,
  isInvalid: boolean,
  isUnavailable: boolean,
) => {
  if (isUnavailable) {
    return `border-color: ${theme.mojoAccent3} !important;background-image: url("${unavailable}") !important; background-size: calc(5.2em + 0.375rem) calc(1em + 0.375rem) !important;`
  } else if (isValid) {
    return `border-color: ${theme.indogoAccent2} !important;background-image: url("${valid}") !important; background-size: calc(4.2em + 0.375rem) calc(1em + 0.375rem) !important;`
  } else if (isInvalid) {
    return `border-color: ${theme.mojoAccent3} !important;background-image: url("${invalid}") !important; background-size: calc(3em + 0.375rem) calc(1em + 0.375rem) !important;`
  }
  return `border-color: ${theme.grey40};`
}

const CustomInput = styled(FormControl)<{
  isValid?: boolean
  isInvalid?: boolean
  $isUnavailable?: boolean
  $block?: boolean
  $paddingRight?: number
}>`
  background-color: ${theme.primaryBlack};
  color: ${theme.grey100};
  margin-top: 8px;
  ${({ $paddingRight }) =>
    $paddingRight ? `padding-right: ${$paddingRight}px;` : ''};
  border-color: ${theme.grey40};
  &:focus {
    background-color: ${theme.primaryBlack};
    color: ${theme.grey100};
    outline: none;
    box-shadow: none;
    border-color: ${theme.indogoAccent2};
    -webkit-box-shadow: none;
  }
  &:disabled {
    background-color: ${theme.grey20};
    border-color: ${theme.grey20};
    -webkit-text-fill-color: ${theme.grey70};
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    display: none;
  }
  &[type='number'] {
    -moz-appearance: textfield;
  }
  ${({ isValid, isInvalid, $isUnavailable }) =>
    getInputValueForState(
      isValid ?? false,
      isInvalid ?? false,
      $isUnavailable ?? false,
    )}
`

const InputContainer = styled.div<{ $block?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ $block }) => ($block ? 'width: 100%' : '')};
`

const InputButtonBlock = styled.div`
  display: flex;
  position: relative;
`
const ButtonsContainer = styled.div<{ $top?: number }>`
  position: absolute;
  ${({ $top }) => `top: ${$top || 8}px`};
  right: 0;
`

const Anm = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }

  10% {
    transform: translateY(-100%);
  }

  15% {
    transform: translateY(0);
  }

  30% {
    transform: translateY(-10%);
  }

  40% {
    transform: translateY(0%);
  }

  100% {
    opacity: 1;
  }
`

export const CopyButton = styled(Button)<{ $wasClicked?: boolean }>`
  padding: 8px;
  align-items: center;
  ${({ $wasClicked }) => {
    return $wasClicked
      ? css`
          animation: ${Anm} 0.6s 0.1s 1 linear alternate;
          background-color: transparent !important;
        `
      : ''
  }}
`

const HideShowButton = styled(Button)`
  padding: 8px;
`

const SearchButton = styled(Button)`
  padding: 0px 0px 0px 6px;
  height: 18px;
  margin: 7px;
  border-radius: 0px;
  border-left: 1px solid ${theme.grey30} !important;
  background-color: transparent !important;
  &:hover {
    background-color: transparent !important;
    img {
      filter: brightness(130%);
    }
  }
  img {
    margin-bottom: 5px;
  }
`

export const Info = styled.div`
  font-size: 14px;
  color: ${theme.grey70};
  margin-top: 8px;
  @media (max-width: 720px) {
    max-width: 270px;
  }
`

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      onChange,
      label,
      info,
      error,
      hideError,
      isValid,
      isUnavailable,
      style,
      hasSmallLabel,
      block,
      defaultValue,
      id,
      onClickCopy,
      onClickSearch,
      shouldShowHideShowButton,
      type,
      value,
      ...props
    },
    ref,
  ) => {
    const [inputType, setInputType] = useState(type || 'text')
    const [wasClicked, setWasClicked] = useState(false)

    const shouldShowErrorState =
      !(error === false || error === '' || error === undefined) || isUnavailable
    const shouldDisplayInfo = !shouldShowErrorState && info
    const errorMessage = typeof error === 'string' ? error : null

    useEffect(() => {
      if (wasClicked) {
        const timeoutId = setTimeout(() => {
          setWasClicked(false)
        }, 800)
        return () => clearTimeout(timeoutId)
      }
    }, [wasClicked])

    return (
      <InputContainer $block={block}>
        <Label $small={hasSmallLabel} htmlFor={id}>
          {label}
          <InputButtonBlock>
            <CustomInput
              ref={ref}
              $isUnavailable={isUnavailable}
              $paddingRight={onClickSearch ? 38 : undefined}
              defaultValue={defaultValue}
              isInvalid={shouldShowErrorState}
              isValid={isValid && !shouldShowErrorState}
              style={style}
              onChange={onChange}
              type={inputType}
              value={String(value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onClickSearch?.()
                }
              }}
            />
            {!(error || isUnavailable || isValid) && (
              <ButtonsContainer $top={onClickSearch ? 10 : 8}>
                {shouldShowHideShowButton && (
                  <>
                    {inputType === 'password' ? (
                      <HideShowButton
                        variant="secondary-borderless"
                        onClick={() => setInputType('text')}
                      >
                        <img alt="show" src={show} />
                      </HideShowButton>
                    ) : (
                      <HideShowButton
                        variant="secondary-borderless"
                        onClick={() => setInputType('password')}
                      >
                        <img alt="hide" src={hide} />
                      </HideShowButton>
                    )}
                  </>
                )}
                {onClickCopy && (
                  <CopyButton
                    $wasClicked={wasClicked}
                    variant="secondary-borderless"
                    onClick={(event) => {
                      event.preventDefault()
                      setWasClicked(true)
                      event.currentTarget.blur()
                      onClickCopy(String(value))
                    }}
                  >
                    <img alt="copy" src={copy} />
                  </CopyButton>
                )}
                {onClickSearch && (
                  <SearchButton
                    disabled={props.disabled}
                    variant="secondary-borderless"
                    onClick={(event) => {
                      event.preventDefault()
                      event.currentTarget.blur()
                      onClickSearch()
                    }}
                  >
                    <img alt="search" src={search} />
                  </SearchButton>
                )}
              </ButtonsContainer>
            )}
          </InputButtonBlock>
        </Label>
        {shouldDisplayInfo && <InfoText>{info}</InfoText>}
        {errorMessage && !hideError && <ErrorText>{errorMessage}</ErrorText>}
      </InputContainer>
    )
  },
)

export default Input
