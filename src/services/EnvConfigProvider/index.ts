import { useMemo } from 'react'


export type ClientConfig = {
  discoveryServiceUrl: string
  isDocker: boolean
}

export const useClientConfig = (): ClientConfig => {
  const env = import.meta.env
  const envConfig = useMemo(
    () => ({
      discoveryServiceUrl: env.VITE_REACT_APP_DISCOVERY_SERVICE_URL || '',
      isDocker: !!env.VITE_REACT_APP_DOCKER,
    }),
    [env.VITE_REACT_APP_DISCOVERY_SERVICE_URL, env.VITE_REACT_APP_DOCKER]
  )

  return envConfig
}
