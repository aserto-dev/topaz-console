import React, { PropsWithChildren, useMemo } from 'react'

import { RpcStatus } from '../../../types/directory'
import GenericIdentityProvider from '../GenericIdentityProvider'
import ApiKeyLogin from './login'
import { useStorage } from '../../StorageProvider/hooks'

export type ApiKeyContextProps = {
  apiKey: string | undefined
  setApiKey: (apiKey: string) => void
  loginFunc: (key: string) => Promise<RpcStatus | Error | undefined>
}

const ApiKeyContext = React.createContext<ApiKeyContextProps>({
  apiKey: undefined,
  setApiKey: () => {},
  loginFunc: () => Promise.resolve(undefined),
})

export type ApiKeyProviderProps = {
  loginFunc: (key: string) => Promise<RpcStatus | Error | undefined>
}

export const ApiKeyIdentityProvider: React.FC<
  PropsWithChildren<ApiKeyProviderProps>
> = ({ loginFunc, children }) => {
  const [apiKey, setApiKey] = useStorage<string | undefined>(
    'apiKey',
    undefined,
  )

  const value: ApiKeyContextProps = useMemo(
    () => ({
      apiKey: apiKey,
      setApiKey: setApiKey,
      loginFunc: loginFunc,
    }),
    [apiKey, setApiKey, loginFunc],
  )

  if (apiKey) {
    return (
      <GenericIdentityProvider
        identity={{
          user: {
            name: 'API Key',
          },
          getAccessToken: () => Promise.resolve(`Basic ${apiKey}`),
          logout: () => {
            localStorage.removeItem('apiKey')
            window.location.href = '/'
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
