import React from 'react'
import styled from 'styled-components'
import { useQueryClient } from '@tanstack/react-query'

import Button from '../../../../components/common/Button'
import { CardModal } from '../../../../components/common/CardModal'
const ContentContainer = styled.div`
  padding: 20px;
  width: 100%;
`

const ButtonsContainer = styled.div`
  width: 100%;
  flex: 1 1 0%;
  justify-content: flex-end;
  align-items: flex-end;
  float: right;
  display: flex;
  margin-top: 20px;
  button:first-of-type {
    margin-right: 10px;
  }
`

type DataChangedModalProps = {
  changedDataType: string
  show: boolean
  onHide: () => void
  onReload?: () => void
}

const DataChangedModal: React.FC<DataChangedModalProps> = ({
  changedDataType,
  show,
  onHide,
  onReload,
}) => {
  const queryClient = useQueryClient()
  return (
    <CardModal
      cardHeight="100%"
      show={show}
      title={`${changedDataType} is out of sync`}
      onHide={onHide}
    >
      <ContentContainer className="out-of-sync-object-modal">
        <div>
          The data for this {changedDataType.toLocaleLowerCase()} has changed. Choose{' '}
          <strong>Reload</strong> below to load the new values, or <strong>Cancel</strong> to cancel
          this change.
        </div>
        <ButtonsContainer>
          <Button data-testid="cancel-btn" variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button
            data-testid="reload-object-btn"
            id="reload-object"
            onClick={() => {
              queryClient.refetchQueries({ type: 'active' })
              onHide()
              onReload?.()
            }}
          >
            Reload
          </Button>
        </ButtonsContainer>
      </ContentContainer>
    </CardModal>
  )
}

export default DataChangedModal
