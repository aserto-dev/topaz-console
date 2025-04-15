import React, { PropsWithChildren, useMemo } from 'react'

import { RpcStatus } from '../../../types/directory'
import { useStorage } from '../../StorageProvider/hooks'
import GenericIdentityProvider from '../GenericIdentityProvider'
import ApiKeyLogin from './login'

type ApiKeyContextProps = {
  apiKey: string | undefined
  loginFunc: (key: string) => Promise<Error | RpcStatus | undefined>
  setApiKey: (apiKey: string) => void
}

const ApiKeyContext = React.createContext<ApiKeyContextProps>({
  apiKey: undefined,
  loginFunc: () => Promise.resolve(undefined),
  setApiKey: () => {},
})

export type ApiKeyProviderProps = {
  loginFunc: (key: string) => Promise<Error | RpcStatus | undefined>
}

export const ApiKeyIdentityProvider: React.FC<
  PropsWithChildren<ApiKeyProviderProps>
> = ({ children, loginFunc }) => {
  const [apiKey, setApiKey] = useStorage<string | undefined>(
    'apiKey',
    undefined,
  )

  const value: ApiKeyContextProps = useMemo(
    () => ({
      apiKey: apiKey,
      loginFunc: loginFunc,
      setApiKey: setApiKey,
    }),
    [apiKey, setApiKey, loginFunc],
  )

  if (apiKey) {
    return (
      <GenericIdentityProvider
        identity={{
          getAccessToken: () => Promise.resolve(`Basic ${apiKey}`),
          logout: () => {
            localStorage.removeItem('apiKey')
            window.location.href = '/'
          },
          user: {
            name: 'API Key',
          },
        }}
      >
        {children!}
      </GenericIdentityProvider>
    )
  }
  return (
    <ApiKeyContext.Provider value={value}>
      <ApiKeyLogin loginFunc={loginFunc} setApiKey={setApiKey}></ApiKeyLogin>
    </ApiKeyContext.Provider>
  )
}
