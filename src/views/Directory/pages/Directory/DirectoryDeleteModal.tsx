import React from 'react'
import styled from 'styled-components'

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

type DirectoryDeleteModalProps = {
  deleteData: { name: string; type: string; }
  onClickRemove: () => void
  onHide: () => void
  show: boolean
  specificText?: string
}

const DirectoryDeleteModal: React.FC<DirectoryDeleteModalProps> = ({
  deleteData,
  onClickRemove,
  onHide,
  show,
  specificText,
}) => {
  return (
    <CardModal
      cardHeight="100%"
      show={show}
      title={`Delete ${deleteData.type}`}
      variant="delete_danger"
      onHide={onHide}
    >
      <ContentContainer>
        <div>
          {specificText ||
            `Delete the
              ${deleteData.type.toLocaleLowerCase()}
              "${deleteData.name}" from the directory.`}
        </div>
        <ButtonsContainer>
          <Button data-testid="cancel-btn" variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button
            data-testid={`delete-${deleteData.type.toLocaleLowerCase()}`}
            id={`delete-${deleteData.type.toLocaleLowerCase()}`}
            variant="danger"
            onClick={() => {
              onClickRemove()
              onHide()
            }}
          >
            Delete
          </Button>
        </ButtonsContainer>
      </ContentContainer>
    </CardModal>
  )
}

export default DirectoryDeleteModal
