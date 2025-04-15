import React from 'react'

import PageHeader from '../../components/common/PageHeader'
import { Header } from './styles'

const HeaderComponent: React.FC = () => {
  return (
    <Header>
      <PageHeader hasBorderBottom={true} title="Authorizer"></PageHeader>
    </Header>
  )
}

export default HeaderComponent
