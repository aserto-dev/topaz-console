import React from 'react'
import { Modal } from 'react-bootstrap'
import styled from 'styled-components'

import { theme } from '../../../theme'
import { Card, Variant } from '../Card'

const CardModalContainer = styled(Modal)<{
  $minWidth?: string
  backgroundcolor?: string
  fullscreen?: boolean | string
}>`
  overflow-x: hidden;
  border-radius: 20px;
  .modal-dialog {
    min-width: ${({ $minWidth }) => $minWidth};
  }
  .modal-content {
    ${({ fullscreen }) => !fullscreen && `max-width: 85vw;`}
    border-radius: 20px;
    background-color: ${theme.grey20};
    color: ${theme.grey100};
    min-width: ${({ $minWidth }) => $minWidth};
  }
  background-color: ${({ backgroundcolor }) => backgroundcolor};
`

type CardModalProps = {
  backgroundColor?: string
  cardHeight?: number | string
  cardWidth?: number | string
  centered?: boolean
  children: React.ReactElement | string
  closeButton?: boolean
  fullscreen?: boolean | string
  minWidth?: string
  onHide?: () => void
  onSubmit?: () => void
  show?: boolean
  size?: string
  text?: React.ReactElement | string
  title: string
  variant?: Variant
}

const CardModal: React.FC<CardModalProps> = ({
  backgroundColor,
  cardHeight,
  cardWidth = 500,
  centered = true,
  children,
  closeButton,
  fullscreen,
  minWidth,
  onHide,
  onSubmit,
  show,
  size,
  text,
  title,
  variant,
}) => {
  const minHeight = '215px'
  return (
    <CardModalContainer
      $minWidth={minWidth}
      backgroundcolor={backgroundColor}
      centered={centered}
      data-testid="modal"
      fullscreen={fullscreen}
      show={show}
      size={size as 'lg' | 'sm' | 'xl' | undefined}
      onHide={onHide}
    >
      <Card
        body={children}
        fullscreen={fullscreen}
        height={cardHeight}
        style={{
          minHeight,
        }}
        text={text}
        title={title}
        variant={variant}
        width={cardWidth}
        onClose={closeButton ? onHide : undefined}
        onSubmit={onSubmit}
      />
    </CardModalContainer>
  )
}

export { CardModal }
