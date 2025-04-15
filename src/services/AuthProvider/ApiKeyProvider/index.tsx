import React, { PropsWithChildren } from 'react'

import { ApiKeyIdentityProvider, ApiKeyProviderProps } from '../../Identity/ApiKeyIdentityProvider'

const ApiKeyProvider: React.FC<PropsWithChildren<ApiKeyProviderProps>> = ({
  children,
  loginFunc,
}) => {
  return <ApiKeyIdentityProvider loginFunc={loginFunc}>{children}</ApiKeyIdentityProvider>
}

export default ApiKeyProvider
