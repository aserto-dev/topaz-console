import { useMemo } from 'react'


 type ClientConfig = {
  discoveryServiceUrl: string
  isDocker: boolean
}

export const useClientConfig = (): ClientConfig => {
  const env = import.meta.env
  const envConfig = useMemo(
    () => ({
      discoveryServiceUrl: env.VITE_REACT_APP_DISCOVERY_SERVICE_URL || getAppHostURL() ,
      isDocker: !!env.VITE_REACT_APP_DOCKER,
    }),
    [env.VITE_REACT_APP_DISCOVERY_SERVICE_URL, env.VITE_REACT_APP_DOCKER]
  )

  return envConfig
}

const getAppHostURL = (): string => {
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
}
