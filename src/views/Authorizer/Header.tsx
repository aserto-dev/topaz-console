import React from 'react'

import { Header } from './styles'
import PageHeader from '../../components/common/PageHeader'

const HeaderComponent: React.FC = () => {
  return (
    <Header>
      <PageHeader hasBorderBottom={true} title="Authorizer"></PageHeader>
    </Header>
  )
}

export default HeaderComponent
