import React, { PropsWithChildren } from 'react'

import HeaderComponent from './Header'
import { Content, Grid, Sidebar } from './styles'
import PaddedContent from '../../components/common/PaddedContent'
import AuthorizerSidebar from './Sidebar'

const Frame: React.FC<PropsWithChildren<object>> = ({ children }) => {
  return (
    <PaddedContent>
      <Grid>
        <HeaderComponent />
        <Sidebar>
          <AuthorizerSidebar />
        </Sidebar>
        <Content>{children}</Content>
      </Grid>
    </PaddedContent>
  )
}

export default Frame
