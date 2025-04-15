import React from 'react'
import { Outlet } from 'react-router'

import PaddedContent from '../../components/common/PaddedContent'
import HeaderComponent from './Header'
import AuthorizerSidebar from './Sidebar'
import { Content, Grid, Sidebar } from './styles'

const Frame: React.FC = () => {
  return (
    <PaddedContent>
      <Grid>
        <HeaderComponent />
        <Sidebar>
          <AuthorizerSidebar />
        </Sidebar>
        <Content>
          <Outlet />
        </Content>
      </Grid>
    </PaddedContent>
  )
}

export default Frame
