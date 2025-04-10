import React from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";

import { theme } from "../../../theme";
import { Card, Variant } from "../Card";

const CardModalContainer = styled(Modal)<{
  backgroundcolor?: string;
  fullscreen?: string | boolean;
  $minWidth?: string;
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
`;

export type CardModalProps = {
  backgroundColor?: string;
  centered?: boolean;
  title: string;
  onHide?: () => void;
  onSubmit?: () => void;
  children: string | React.ReactElement;
  show?: boolean;
  size?: string;
  cardHeight?: number | string;
  text?: string | React.ReactElement;
  variant?: Variant;
  cardWidth?: number | string;
  fullscreen?: string | boolean;
  closeButton?: boolean;
  minWidth?: string;
};

const CardModal: React.FC<CardModalProps> = ({
  children,
  backgroundColor,
  centered = true,
  title,
  show,
  onHide,
  onSubmit,
  cardHeight,
  cardWidth = 500,
  fullscreen,
  size,
  text,
  variant,
  closeButton,
  minWidth,
}) => {
  const minHeight = "215px";
  return (
    <CardModalContainer
      $minWidth={minWidth}
      backgroundcolor={backgroundColor}
      centered={centered}
      data-testid="modal"
      fullscreen={fullscreen}
      show={show}
      size={size as "sm" | "lg" | "xl" | undefined}
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
  );
};

export { CardModal };
