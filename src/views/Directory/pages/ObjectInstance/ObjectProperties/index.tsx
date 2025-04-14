import React, { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import Button from '../../../../../components/common/Button'
import CodeEditor from '../../../../../components/common/CodeEditor'
import { useDirectoryDisplayState } from '../../../../../services/DirectoryContextProvider/hooks'
import { useShowError } from '../../../../../services/ErrorModalProvider'
import { V3Object } from '../../../../../types/directory'
import EvaluateDisplayState from '../../../../../components/common/EvaluateDisplayState'
import DataChangedModal from '../../Directory/DataChangedModal'
import {
  getDirectoryReaderV3ObjectsListQueryKey,
  useDirectoryReaderV3ObjectGetQueryOptions,
  useDirectoryWriterV3ObjectSet,
} from '../../../../../api/v3/directory'
import {
  ButtonsContainer,
  ControlsContainer,
  ErrorMessage,
  PropertiesContainer,
} from './styles'
import { useShowSuccessMessage } from '../../../../../services/SuccessBannerProvider/hooks'

const ObjectProperties: React.FC<{ object?: V3Object }> = ({ object }) => {
  const queryClient = useQueryClient()
  const { id: objectId, type: objectType, properties } = object || {}

  const objectsListInfiniteQueryKey = getDirectoryReaderV3ObjectsListQueryKey({
    object_type: objectType,
  })

  const objectGetQueryKey = useDirectoryReaderV3ObjectGetQueryOptions(
    objectType || '',
    objectId || '',
  )
  const { mutate: updateObject, isPending: updatingObject } =
    useDirectoryWriterV3ObjectSet({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: objectsListInfiniteQueryKey,
          })
          queryClient.invalidateQueries(objectGetQueryKey)
        },
      },
    })

  const displayState = useDirectoryDisplayState()

  const showSuccessMessage = useShowSuccessMessage()
  const showError = useShowError()
  const [code, setCode] = useState('')
  const [modified, setModified] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [showDataChangedModal, setShowDataChangedModal] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const resetCode = useCallback(() => {
    if (properties) {
      setCode(JSON.stringify(properties, null, 2))
      setModified(false)
    }

    setError(undefined)
    setShowErrorMessage(false)
  }, [properties])

  const saveCode = useCallback(() => {
    if (object) {
      let parsed: unknown

      if (code) {
        try {
          parsed = JSON.parse(code)
          setError(undefined)
        } catch (e) {
          setError(String(e))
          setShowErrorMessage(true)
        }
      }

      if (parsed) {
        updateObject(
          {
            data: {
              object: { ...object, properties: JSON.parse(code) },
            },
          },
          {
            onError: (e) => {
              if ((e as Error).message.includes('hash mismatch')) {
                setShowDataChangedModal(true)
              } else {
                showError(e)
              }
            },
            onSuccess: () => {
              showSuccessMessage('Properties updated successfully.')
              setModified(false)
            },
          },
        )
      }
    }
  }, [code, object, showError, showSuccessMessage, updateObject])

  useEffect(() => {
    resetCode()
  }, [resetCode])

  return (
    <PropertiesContainer>
      {object ? (
        <>
          <ControlsContainer>
            <EvaluateDisplayState displayState={displayState.canEditObject}>
              <ButtonsContainer>
                <Button
                  disabled={!modified || updatingObject}
                  variant="secondary"
                  onClick={resetCode}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!modified || updatingObject}
                  variant="primary"
                  onClick={saveCode}
                >
                  Save
                </Button>
              </ButtonsContainer>
            </EvaluateDisplayState>
            {showErrorMessage ? <ErrorMessage>{error}</ErrorMessage> : <div />}
          </ControlsContainer>
          <CodeEditor
            hasError={!!error}
            readOnly={updatingObject || !displayState.canEditObject.enabled}
            value={code}
            onValueChange={(c) => {
              setCode(c)
              setModified(true)
              try {
                JSON.parse(c)
                setShowErrorMessage(false)
                setError(undefined)
              } catch (e) {
                setError(String(e))
              }
            }}
          />
          <DataChangedModal
            changedDataType="Object"
            show={showDataChangedModal}
            onHide={() => setShowDataChangedModal(false)}
          />
        </>
      ) : (
        'This object is external to the directory.'
      )}
    </PropertiesContainer>
  )
}

export default ObjectProperties
