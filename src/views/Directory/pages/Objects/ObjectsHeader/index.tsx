import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import plus from '../../../../../assets/plus.svg'
import { useDirectoryDisplayState } from '../../../../../services/DirectoryContextProvider/hooks'
import EvaluateDisplayState from '../../../../../components/common/EvaluateDisplayState'
import { AddButton } from '../../../styles'
import AddObjectModal from '../AddObjectModal'
import { Header, SubHeader, TitleContainer } from './styles'
import { useQueryClient } from '@tanstack/react-query'

const ObjectsHeader: React.FC<React.ComponentProps<'div'>> = ({
  children,
  className,
}) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const displayState = useDirectoryDisplayState()

  const { objectType: objectTypeName } = useParams()
  const safeObjectType = objectTypeName || ''

  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <Header className={className}>
      <AddObjectModal
        objectTypeName={objectTypeName}
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSuccess={(v) => {
          setShowAddModal(false)
          queryClient.refetchQueries({ type: 'active' })
          navigate(
            `/ui/directory/objects/${safeObjectType}/${encodeURIComponent(v.id)}`,
            {
              replace: true,
            },
          )
        }}
      />
      <TitleContainer>
        <SubHeader>
          <EvaluateDisplayState displayState={displayState.canEditManifest}>
            <AddButton
              variant="secondary"
              onClick={() => setShowAddModal(true)}
            >
              <img alt="plus" src={plus} />
              Add
            </AddButton>
          </EvaluateDisplayState>
          {children}
        </SubHeader>
      </TitleContainer>
    </Header>
  )
}

export default ObjectsHeader
