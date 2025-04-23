import React, { useCallback } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import pen from '../../../../assets/edit_pen.svg'
import PageHeader from '../../../../components/common/PageHeader'
import PageHeaderContent from '../../../../components/common/PageHeaderContent'
import { useDirectoryModelContext } from '../../../../services/DirectoryContextProvider/hooks'
import { EditButton, EditImage, Header } from './styles'

const HeaderComponent: React.FC = () => {
  const { setVisible, visible } = useDirectoryModelContext()
  const queryClient = useQueryClient()
  const pathname = window.location.pathname

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
            <EditButton hidden={visible} onClick={() => setVisible(true)}>
              <EditImage alt="plus" src={pen}></EditImage>&nbsp;&nbsp;Edit
              manifest
            </EditButton>
          )}
        </PageHeaderContent>
      </PageHeader>
    </Header>
  )
}

export default HeaderComponent
