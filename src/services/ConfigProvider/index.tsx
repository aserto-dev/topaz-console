import React, { PropsWithChildren, useEffect } from 'react'

import { useInternalConfig } from '../../api/internal/config'
import { InformationalError } from '../../lib/error/InformationalError'
import { useShowError } from '../ErrorModalProvider'
import { ConfigContext } from './hooks'

const ConfigProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: config, error } = useInternalConfig()
  const showError = useShowError()

  useEffect(() => {
    if (error) {
      showError(
        new InformationalError(
          'This may be a temporary error. Please try reloading this page.',
          'Looks like we are having issues with our services :(',
        ),
      )
    }
  }, [error, showError])

  return !config ? null : (
    <ConfigContext.Provider
      value={{
        authenticationType: config.authenticationType || 'anonymous',
        ...config.configs[0],
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider
