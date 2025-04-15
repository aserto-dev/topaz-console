import React from 'react'
import { Outlet } from 'react-router'

import PaddedContent from '../../../../components/common/PaddedContent'
import { Content, Grid, Sidebar } from '../../styles'
import { DirectorySidebar } from './DirectorySidebar'
import HeaderComponent from './Header'
import DirectoryContextProvider from '../../../../services/DirectoryContextProvider'

const Frame: React.FC = () => {
  return (
    <DirectoryContextProvider
      displayState={{
        canAddObject: { enabled: true, visible: true },
        canAddRelation: { enabled: true, visible: true },
        canDeleteDirectory: { enabled: true, visible: true },
        canEditManifest: { enabled: true, visible: true },
        canEditObject: { enabled: true, visible: true },
        canRemoveRelation: { enabled: true, visible: true },
        canRemoveAssertion: { enabled: true, visible: true },
        canAddAssertion: { enabled: true, visible: true },
        canEditAssertion: { enabled: true, visible: true },
      }}
    >
      <PaddedContent>
        <Grid>
          <HeaderComponent />
          <Sidebar>
            <DirectorySidebar />
          </Sidebar>
          <Content>
            <Outlet />
          </Content>
        </Grid>
      </PaddedContent>
    </DirectoryContextProvider>
  )
}

export default Frame
