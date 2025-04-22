import { useClientConfig } from "../../services/EnvConfigProvider"
import { useStorage } from "../../services/StorageProvider/hooks"
import { useBaseClient } from "./base"


export const useConfigClient = () => {
  const envConfig = useClientConfig()
  const [ apiKey ] = useStorage<string | undefined>('apiKey', undefined)

  const headers: Record<string, string> = {}
  if (apiKey) {
    headers['authorization'] = `basic ${apiKey}`
  }
  const discoveryServiceUrl = envConfig.isDocker
    ? window.location.origin
    : envConfig.discoveryServiceUrl
  return useBaseClient(`${discoveryServiceUrl}/api/v2`, headers)
}
