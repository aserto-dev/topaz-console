import React, { PropsWithChildren } from 'react'

import GenericIdentityProvider from '../GenericIdentityProvider'

export const AnonymousIdentityProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <GenericIdentityProvider
      identity={{
        user: undefined,
        getAccessToken: () => Promise.resolve(''),
        logout: () => {},
      }}
    >
      {children!}
    </GenericIdentityProvider>
  )
}
