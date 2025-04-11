import React, { PropsWithChildren } from 'react'

import { ApiKeyIdentityProvider, ApiKeyProviderProps } from '../../Identity/ApiKeyIdentityProvider'

const ApiKeyProvider: React.FC<PropsWithChildren<ApiKeyProviderProps>> = ({
  loginFunc,
  children,
}) => {
  return <ApiKeyIdentityProvider loginFunc={loginFunc}>{children}</ApiKeyIdentityProvider>
}

export default ApiKeyProvider
