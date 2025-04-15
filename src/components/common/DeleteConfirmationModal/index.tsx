import React, { ReactNode, useMemo, useState } from 'react'

import { createExactMatchValidator } from '../../../lib/validation/validators/exactMatch'
import Button from '../Button'
import { CardModal } from '../CardModal'
import { Info } from '../Input'
import ValidatedInput from '../ValidatedInput'
import {
  ButtonsContainer,
  ContentContainer,
  InputContainer,
  Text,
  TextArea,
} from './styles'

type DeleteConfirmationModalProps = {
  content?: ReactNode
  entityName: string
  onClickRemove: () => void
  onHide: () => void
  show: boolean
  subject: string
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  content,
  entityName,
  onClickRemove,
  onHide,
  show,
  subject,
}) => {
  const onClickHideButton = onHide
  const validatedUserInput = useMemo(
    () => createExactMatchValidator(entityName),
    [entityName],
  )
  const [validationText, setValidationText] = useState<string | undefined>()
  const capitalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1)
  const disableDeleteButton = !validationText ? { disabled: true } : {}

  return (
    <>
      <CardModal
        cardHeight="100%"
        show={show}
        title={`Delete ${subject}`}
        variant="delete_danger"
        onHide={onClickHideButton}
        onSubmit={onClickRemove}
      >
        <ContentContainer>
          {content
            ? content
            : subject !== 'policy' &&
              subject !== 'directory' && (
                <>
                  <TextArea>
                    We will immediately delete all of your {subject} artifacts
                    (policies, images, directory data, and connections).
                  </TextArea>
                  <br />
                  <Text>
                    Your {subject} name cannot be reused until we recycle it,
                    within the next 7 days. It will then be available for anyone
                    to claim.
                  </Text>
                  <br />
                </>
              )}
          <InputContainer>
            <ValidatedInput
              autoFocus
              data-testid="input"
              label={
                subject !== 'manifest'
                  ? `${capitalizedSubject} name`
                  : undefined
              }
              validator={validatedUserInput}
              onChange={setValidationText}
            />
            <Info>
              <Text>
                <Text>
                  Please type
                  <Text bold>
                    &nbsp; {entityName} &nbsp;
                    <Text>to confirm.</Text>
                  </Text>
                </Text>
              </Text>
            </Info>
          </InputContainer>
          <br />
          <TextArea>
            Are you sure you want to delete your {subject}?
            <br /> This cannot be undone.
          </TextArea>
          <ButtonsContainer>
            <Button variant="secondary" onClick={onClickHideButton}>
              Cancel
            </Button>
            <Button
              data-testid="delete-subject"
              {...disableDeleteButton}
              type="submit"
              variant="danger"
            >
              Delete {subject}
            </Button>
          </ButtonsContainer>
        </ContentContainer>
      </CardModal>
    </>
  )
}

export default DeleteConfirmationModal
