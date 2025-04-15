import React from 'react'

import { GenericIdentityProviderProps, identityProviderContext } from './hooks'

const GenericIdentityProvider: React.FC<GenericIdentityProviderProps> = ({
  children,
  identity,
}) => {
  return !identity ? null : (
    <identityProviderContext.Provider value={identity}>
      {children}
    </identityProviderContext.Provider>
  )
}

export default GenericIdentityProvider
