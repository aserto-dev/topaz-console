import { useState } from 'react'
import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import chance from '../../../testing/factories/Chance'
import DeleteConfirmationModal from '.'

describe('<DeleteConfirmationModal>', () => {
  let subject: string
  let alt: string
  let entityName: string
  const handleClose = jest.fn()
  beforeEach(
    () => ((subject = chance.animal()), (alt = chance.animal()), (entityName = chance.name()))
  )

  describe('When it is configured not to show itself', () => {
    it('is not visible', async () => {
      render(
        <DeleteConfirmationModal
          entityName={entityName}
          show={false}
          subject={subject}
          onClickRemove={() => {}}
          onHide={handleClose}
        />
      )
      await waitFor(() => {
        expect(screen.queryByText('Please type', { exact: false })).not.toBeInTheDocument()
      })
    })
  })

  describe('When it is configured to show itself', () => {
    it('Has a header', () => {
      render(
        <DeleteConfirmationModal
          entityName={entityName}
          show={true}
          subject={subject}
          onClickRemove={() => {}}
          onHide={handleClose}
        />
      )
      expect(
        screen.getByText(`Are you sure you want to delete your ${subject}`, {
          exact: false,
        })
      ).toBeVisible()
    })
    it('Has a `Cancel` button', async () => {
      render(
        <DeleteConfirmationModal
          entityName={entityName}
          show={true}
          subject={subject}
          onClickRemove={() => {}}
          onHide={handleClose}
        />
      )

      await waitFor(() => {
        const cancelButton = screen.getByText('Cancel')
        expect(cancelButton).toBeVisible()
      })
    })

    test('When the user clicks on Cancel button', async () => {
      const alt = chance.animal()
      render(<DeleteConfirmationModalOrAlt alt={alt} entityName={entityName} subject={subject} />)
      const cancelButton = await screen.findByText('Cancel')
      act(() => {
        fireEvent.click(cancelButton)
      })
      expect(await screen.findByText(alt)).toBeVisible()
      await waitFor(() => expect(screen.queryByText('Cancel')).not.toBeInTheDocument(), {
        timeout: 3000,
      })
    })

    it('Has a `Delete` button', async () => {
      render(
        <DeleteConfirmationModal
          entityName={entityName}
          show={true}
          subject={subject}
          onClickRemove={() => {}}
          onHide={handleClose}
        />
      )

      await waitFor(() => {
        const deleteButton = screen.getByText(`Delete ${subject}`, { selector: 'button' })
        expect(deleteButton).toBeVisible()
      })
    })

    describe('When the user has provided correct input', () => {
      it('has the delete button enabled', async () => {
        render(<DeleteConfirmationModalOrAlt alt={alt} entityName={entityName} subject={subject} />)
        const input = screen.getByLabelText(`${subject}`, { exact: false })
        fireEvent.change(input, { target: { value: entityName } })
        await waitFor(() => {
          const deleteButton = screen.getByText(`Delete ${subject}`, { selector: 'button' })
          expect(deleteButton).not.toBeDisabled()
        })
      })
    })
    describe('When the user has provided incorrect input', () => {
      it('The `Delete` button is disabled', async () => {
        render(<DeleteConfirmationModalOrAlt alt={alt} entityName={entityName} subject={subject} />)
        const input = screen.getByLabelText(`${subject}`, { exact: false })
        fireEvent.change(input, { target: { value: 'notmyaccountname' } })
        await waitFor(() => {
          const deleteButton = screen.getByText(`Delete ${subject}`, { selector: 'button' })
          expect(deleteButton).toBeDisabled()
        })
      })
    })
  })
})

const DeleteConfirmationModalOrAlt = ({
  subject,
  alt,
  entityName,
}: {
  subject: string
  alt: string
  entityName: string
}) => {
  const [showModal, setShowModal] = useState(true)
  return (
    <>
      <DeleteConfirmationModal
        entityName={entityName}
        show={showModal}
        subject={subject}
        onClickRemove={() => {}}
        onHide={() => {
          setShowModal(false)
        }}
      />
      {!showModal && <p>{alt}</p>}
    </>
  )
}
