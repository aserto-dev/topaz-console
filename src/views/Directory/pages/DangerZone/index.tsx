import React, { useState } from 'react'
import styled from 'styled-components'

import { useDirectoryModelContext } from '../../../../services/DirectoryContextProvider/hooks'
import { useShowError } from '../../../../services/ErrorModalProvider'
import { useShowSuccessMessage } from '../../../../services/SuccessBannerProvider/hooks'
import { theme } from '../../../../theme'
import Button from '../../../../components/common/Button'
import DeleteConfirmationModal from '../../../../components/common/DeleteConfirmationModal'
import { useDirectoryModelV3ManifestDelete } from '../../../../api/v3/directory'

const DeleteContainer = styled.div`
  font-family: Roboto;
  padding: 22px 30px;
`

const Text = styled.div<{ bold?: boolean; color?: string; size?: string }>`
  font-weight: ${({ bold }) => (bold ? 'bold' : 100)};
  font-size: ${({ size }) => size};
  color: ${({ color }) => color};
  padding-top: 8px;
`

const DangerZone: React.FC = () => {
  const { setCode } = useDirectoryModelContext()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const showError = useShowError()
  const showSuccessMessage = useShowSuccessMessage()

  const { mutate: deleteManifest } = useDirectoryModelV3ManifestDelete({
    mutation: {
      onError: (error) => {
        showError(error)
      },
      onSuccess: () => {
        setCode('')
        setShowDeleteModal(false)
        showSuccessMessage('Directory deleted successfully')
      },
    },
  })

  return (
    <>
      <DeleteConfirmationModal
        entityName="delete"
        show={showDeleteModal}
        subject="directory"
        onClickRemove={() => deleteManifest({})}
        onHide={() => setShowDeleteModal(false)}
      />
      <DeleteContainer>
        <Text bold color={theme.grey100} size="14px">
          Reset to an empty directory
        </Text>
        <Text color={theme.mojoAccent3} size="14px">
          Permanently delete the model and all the data in the directory.
          <br />
        </Text>
        <br />
        <Button
          data-testid="reset-template"
          variant="danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete directory
        </Button>
      </DeleteContainer>
    </>
  )
}

export default DangerZone
