import React, { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import pen from '../../../../assets/edit_pen.svg'
import PageHeader from '../../../../components/common/PageHeader'
import PageHeaderContent from '../../../../components/common/PageHeaderContent'
import {
  useDirectoryDisplayState,
  useDirectoryModelContext,
} from '../../../../services/DirectoryContextProvider/hooks'
import EvaluateDisplayState from '../../../common/EvaluateDisplayState'
import { EditButton, EditImage, Header } from './styles'

const HeaderComponent: React.FC = () => {
  const { visible, setVisible } = useDirectoryModelContext()
  const queryClient = useQueryClient()
  const pathname = window.location.pathname
  const displayState = useDirectoryDisplayState()

  const refresh = useCallback(() => {
    queryClient.refetchQueries({ type: 'active' })
  }, [queryClient])

  return (
    <Header>
      <PageHeader
        hasBorderBottom
        load={refresh}
        mobileBreakpoint={912}
        title="Directory"
      >
        <PageHeaderContent>
          {pathname === '/ui/directory/model' && (
            <EvaluateDisplayState displayState={displayState.canAddObject}>
              <EditButton hidden={visible} onClick={() => setVisible(true)}>
                <EditImage alt="plus" src={pen}></EditImage>&nbsp;&nbsp;Edit
                manifest
              </EditButton>
            </EvaluateDisplayState>
          )}
        </PageHeaderContent>
      </PageHeader>
    </Header>
  )
}

export default HeaderComponent
