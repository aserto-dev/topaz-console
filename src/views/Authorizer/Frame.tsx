import React, { PropsWithChildren } from 'react'

import PaddedContent from '../../components/common/PaddedContent'
import HeaderComponent from './Header'
import AuthorizerSidebar from './Sidebar'
import { Content, Grid, Sidebar } from './styles'

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
