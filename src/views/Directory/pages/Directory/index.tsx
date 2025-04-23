import React from 'react'
import { Outlet } from 'react-router'

import PaddedContent from '../../../../components/common/PaddedContent'
import DirectoryContextProvider from '../../../../services/DirectoryContextProvider'
import { Content, Grid, Sidebar } from '../../styles'
import { DirectorySidebar } from './DirectorySidebar'
import HeaderComponent from './Header'

const Frame: React.FC = () => {
  return (
    <DirectoryContextProvider>
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
