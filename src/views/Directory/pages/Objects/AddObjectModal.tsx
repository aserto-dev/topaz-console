import React, { useState } from 'react'
import styled from 'styled-components'
import { Query, useQueryClient } from '@tanstack/react-query'

import Button from '../../../../components/common/Button'
import { CardModal } from '../../../../components/common/CardModal'
import ValidatedInput from '../../../../components/common/ValidatedInput'
import useIsIdAvailable from '../../../../lib/availability/useIsObjectIdAvailable'
import { DisplayNameValidator, IdValidator } from '../../../../lib/validation'
import { useShowError } from '../../../../services/ErrorModalProvider'
import { V3Object } from '../../../../types/directory'
import {
  getDirectoryReaderV3ObjectGetQueryKey,
  getDirectoryReaderV3ObjectsListQueryKey,
  getDirectoryReaderV3RelationsListQueryKey,
  useDirectoryWriterV3ObjectSet,
} from '../../../../api/v3/directory'

const ContentContainer = styled.div`
  padding: 20px;
  width: 100%;
`

const FormContainer = styled.div`
  margin-top: 18px;
`

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px auto;
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

type AddObjectModalProps = {
  objectTypeName: string | undefined
  onSuccess?: (object: V3Object) => void
  queryKey?: string
  show: boolean
  onHide: () => void
}

const AddObjectModal: React.FC<AddObjectModalProps> = ({
  objectTypeName,
  onHide,
  onSuccess,
  show,
}) => {
  const [id, setId] = useState('')
  const [displayName, setDisplayName] = useState('')
  const showError = useShowError()
  const queryClient = useQueryClient()

  const objectsListInfiniteQueryKey = getDirectoryReaderV3ObjectsListQueryKey({
    object_type: objectTypeName,
  })
  const relationsListInfiniteQueryKey =
    getDirectoryReaderV3RelationsListQueryKey()
  const objectGetQueryKey = getDirectoryReaderV3ObjectGetQueryKey(
    objectTypeName!,
    id,
  )

  const setObject = useDirectoryWriterV3ObjectSet({
    mutation: {
      onError: (e) => {
        showError(e)
      },
      onSuccess: (o) => {
        clearModalState()
        queryClient.invalidateQueries({ queryKey: objectGetQueryKey })
        // remove cache for current object type and all the relations
        queryClient.removeQueries({
          predicate: (query: Query) => {
            return (
              query.queryKey.includes(
                objectsListInfiniteQueryKey[0] as string,
              ) ||
              query.queryKey.includes(
                relationsListInfiniteQueryKey[0] as string,
              )
            )
          },
        })
        onSuccess?.(o.result!)
      },
    },
  })

  const clearModalState = () => {
    setId('')
    setDisplayName('')
  }

  const closeModal = () => {
    clearModalState()
    onHide()
  }

  const isIdAvailable = useIsIdAvailable(objectTypeName)

  return objectTypeName ? (
    <>
      <CardModal
        cardHeight="100%"
        show={show}
        title={`Add ${objectTypeName}`}
        onHide={closeModal}
      >
        <ContentContainer className="add-a-relation-modal-content">
          <div>
            {`Provide a unique ID and a display name for this ${objectTypeName}, and click the Add button.`}
          </div>
          <FormContainer>
            <FieldContainer>
              <ValidatedInput
                autoFocus
                label="ID"
                useIsAvailable={isIdAvailable}
                validator={IdValidator}
                onChange={(v) => setId(v || '')}
              />
            </FieldContainer>
            <FieldContainer>
              <ValidatedInput
                label="Display Name"
                validator={DisplayNameValidator}
                onChange={(v) => setDisplayName(v || '')}
              />
            </FieldContainer>
          </FormContainer>
          <ButtonsContainer>
            <Button
              data-testid="cancel-btn"
              variant="secondary"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              data-testid="add-relation-modal-btn"
              disabled={id === '' || setObject.isPending}
              id="add-relation"
              type="submit"
              onClick={() =>
                setObject.mutate({
                  data: {
                    object: {
                      type: objectTypeName,
                      id: id,
                      display_name: displayName,
                    },
                  },
                })
              }
            >
              Add
            </Button>
          </ButtonsContainer>
        </ContentContainer>
      </CardModal>
    </>
  ) : null
}

export default AddObjectModal
