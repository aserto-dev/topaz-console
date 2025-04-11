import React, { PropsWithChildren } from 'react'

import { AnonymousIdentityProvider } from '../../Identity/AnonymousIdentityProvider'

const AnonymousProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <AnonymousIdentityProvider>{children}</AnonymousIdentityProvider>
}

export default AnonymousProvider
