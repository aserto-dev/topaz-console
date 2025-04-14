import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Query, useQueryClient } from '@tanstack/react-query'

import Button from '../../../../components/common/Button'
import { CardModal } from '../../../../components/common/CardModal'
import ValidatedInput from '../../../../components/common/ValidatedInput'
import { DisplayNameValidator } from '../../../../lib/validation'
import { useShowError } from '../../../../services/ErrorModalProvider'
import { V3Object } from '../../../../types/directory'
import Input from '../../../../components/common/Input'
import { useDirectoryV3ObjectTypesList } from '../../../../api/directory/customQuery'
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

export type EditObjectModalProps = {
  onSuccess?: (object: V3Object) => void
  showDataChangedModal: () => void
  objectInstance: V3Object
  show: boolean
  onHide: () => void
}

const EditObjectModal: React.FC<EditObjectModalProps> = ({
  objectInstance,
  showDataChangedModal,
  show,
  onHide,
  onSuccess,
}) => {
  const [displayName, setDisplayName] = useState('')
  const showError = useShowError()
  const queryClient = useQueryClient()

  const { data } = useDirectoryV3ObjectTypesList({ name: objectInstance?.type })
  const objectType = data?.results?.[0]

  const objectsListInfiniteQueryKey = getDirectoryReaderV3ObjectsListQueryKey({
    object_type: objectInstance?.type,
  })
  const relationsListInfiniteQueryKey =
    getDirectoryReaderV3RelationsListQueryKey()
  const objectGetQueryKey = getDirectoryReaderV3ObjectGetQueryKey(
    objectInstance?.type,
    objectInstance?.id,
  )

  const updateObject = useDirectoryWriterV3ObjectSet({
    mutation: {
      onError: (e) => {
        if ((e as Error).message.includes('hash mismatch')) {
          onHide()
          showDataChangedModal()
        } else {
          showError(e)
        }
      },
      onSuccess: (data) => {
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
        onSuccess?.(data.result!)
      },
    },
  })

  const clearModalState = () => {
    setDisplayName(objectInstance.display_name || '')
  }

  const closeModal = () => {
    clearModalState()
    onHide()
  }

  useEffect(() => {
    const currentObject = objectInstance
    if (!!currentObject && !!currentObject.display_name) {
      setDisplayName(currentObject.display_name)
    }
  }, [objectInstance])

  return objectInstance ? (
    <>
      <CardModal
        cardHeight="100%"
        show={show}
        title={`Update ${objectType?.displayName || objectType?.name}`}
        onHide={closeModal}
      >
        <ContentContainer className="add-a-relation-modal-content">
          <div>
            {`Provide a unique display name for this ${
              objectType?.displayName || objectType?.name
            }, and click the Update button.`}
          </div>
          <FormContainer>
            <FieldContainer>
              <Input disabled label="ID" value={objectInstance.id} />
            </FieldContainer>
            <FieldContainer>
              <ValidatedInput
                autoFocus
                disabled={!objectInstance}
                label="Display Name"
                validator={DisplayNameValidator}
                value={objectInstance.display_name}
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
              data-testid="edit-object-modal-btn"
              disabled={updateObject.isPending}
              id="edit-object"
              type="submit"
              onClick={() => {
                const obj = objectInstance
                if (!obj) {
                  return
                }

                updateObject.mutate({
                  data: {
                    object: { ...obj, display_name: displayName },
                  },
                })
              }}
            >
              Update
            </Button>
          </ButtonsContainer>
        </ContentContainer>
      </CardModal>
    </>
  ) : null
}

export default EditObjectModal
