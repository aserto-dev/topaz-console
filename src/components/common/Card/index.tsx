import React from 'react'
import styled from 'styled-components'

import Button from '../Button'
import { theme, Theme } from '../../../theme'
export type Variant = 'primary' | 'danger' | 'delete_danger'
const getStyleVariantForHeader = (
  variant: Variant = 'primary',
  theme: Theme,
) => {
  const sharedStyle = `background-color: ${theme.mojo50}; color: ${theme.fullWhite}`
  const styleObj = {
    primary: `color: ${theme.grey100}; background-color: ${theme.grey20};`,
    danger: `${sharedStyle}; border-bottom: 1px solid ${theme.grey50}`,
    delete_danger: `${sharedStyle}; border-bottom: 0px solid ${theme.grey50}`,
  }

  return styleObj[variant]
}

const CardContainer = styled.div<{
  height?: number | string
  width?: number | string
  $fullHeight?: boolean
}>`
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  height: ${({ height, $fullHeight }) => {
    if ($fullHeight) {
      return '100%'
    }
    if (height) {
      return `${height}px`
    }
    return ''
  }};
  ${({ width }) => (width ? `width: ${width}px` : `width: 100%`)};
  background-color: ${theme.grey10};
  position: relative;
`

const CardHeader = styled.div<{ $variant?: Variant }>`
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  font-size: 20px;
  font-weight: 400;
  font-family: 'Roboto', sans-serif;
  ${({ $variant, theme }) => getStyleVariantForHeader($variant, theme)}
`

export const CardText = styled.div<{
  $variant?: string
  bold?: boolean
  isInModal?: boolean
}>`
  color: ${theme.grey70};
  font-weight: ${({ bold }) => (bold ? 'bold' : 500)};
  ${({ isInModal }) => {
    return isInModal ? '  padding: 0px 20px 20px;' : 'padding: 20px'
  }};
  border-bottom: 1px solid ${theme.grey30};
`

const CardBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  &:first-child {
    margin: auto;
    width: 100%;
    padding: 20px;
  }
`

const Overlay = styled.div<{
  height?: number | string
  width?: number | string
}>`
  background-color: ${theme.primaryBlack};
  height: 100%;
  ${({ width }) => (width ? `width: ${width}px` : `width: 100%`)};
  position: absolute;
  opacity: 0.75;
  z-index: 2;
`

const HeaderButtons = styled.div`
  display: flex;
`

export type CardProps = {
  title?: string
  text?: string | React.ReactElement
  body: React.ReactElement | string
  height?: number | string
  width?: number | string
  inactive?: boolean
  style?: Theme
  variant?: Variant
  onClose?: () => void
  onRefresh?: () => void
  onSubmit?: () => void
  fullHeight?: boolean
  fullscreen?: boolean | string
  testId?: string
}

export const Card: React.FC<CardProps> = ({
  title,
  text,
  body,
  height,
  inactive,
  width,
  style,
  variant,
  onClose,
  onRefresh,
  onSubmit,
  fullHeight,
  fullscreen,
  testId,
}) => {
  return (
    <CardContainer
      $fullHeight={fullHeight}
      data-testid={testId}
      height={height}
      style={style}
      width={width}
    >
      {inactive && <Overlay height={height} width={width} />}
      {title && (
        <CardHeader $variant={variant}>
          {title}
          <HeaderButtons>
            {onRefresh && (
              <Button
                style={{
                  padding: '2px 10px',
                }}
                variant="secondary-borderless"
                onClick={onRefresh}
              >
                <i className="fa fa-refresh" />
              </Button>
            )}
            {onClose && (
              <Button
                style={{
                  padding: '2px 10px',
                }}
                variant="secondary-borderless"
                onClick={onClose}
              >
                <i className="fa fa-times" />
              </Button>
            )}
          </HeaderButtons>
        </CardHeader>
      )}
      {typeof text === 'string' ? (
        <CardText $variant={variant}>{text}</CardText>
      ) : (
        text
      )}
      <CardBody
        as={!fullscreen ? 'form' : 'div'}
        onSubmit={(e: React.FormEvent<HTMLDivElement | HTMLFormElement>) => {
          e.preventDefault()
          onSubmit?.()
        }}
      >
        {body}
      </CardBody>
    </CardContainer>
  )
}
