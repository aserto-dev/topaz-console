import React, { PropsWithChildren } from 'react'

import GenericIdentityProvider from '../GenericIdentityProvider'

export const AnonymousIdentityProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <GenericIdentityProvider
      identity={{
        getAccessToken: () => Promise.resolve(''),
        logout: () => {},
        user: undefined,
      }}
    >
      {children!}
    </GenericIdentityProvider>
  )
}
