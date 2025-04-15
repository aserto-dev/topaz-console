import React, { PropsWithChildren, useCallback } from 'react'

import { useTopazLogin } from '../../api/internal/login'
import { RpcStatus } from '../../types/directory'
import { useConfig } from '../ConfigProvider/hooks'
import AnonymousProvider from './AnonymousProvider'
import ApiKeyProvider from './ApiKeyProvider'

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { authenticationType } = useConfig()
  const { mutateAsync: login } = useTopazLogin()
  const loginFunc = useCallback(
    async (apiKey: string): Promise<Error | RpcStatus | undefined> => {
      try {
        await login({ apiKey: apiKey })
        return
      } catch (error) {
        return new Promise((resolve) => {
          resolve(error as RpcStatus)
        })
      }
    },
    [login],
  )

  if (authenticationType?.toLowerCase() === 'apikey') {
    return <ApiKeyProvider loginFunc={loginFunc}>{children}</ApiKeyProvider>
  }

  if (authenticationType?.toLowerCase() === 'anonymous') {
    return <AnonymousProvider>{children}</AnonymousProvider>
  }

  throw Error(
    'Authentication type not supported, must be one of ["oidc", "apiKey", "anonymous"]',
  )
}

export default AuthProvider
