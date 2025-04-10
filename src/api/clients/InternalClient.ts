import { useClientConfig } from "../../services/EnvConfigProvider"
import { useBaseClient } from "./base"


export const useInternalClient = () => {
  const envConfig = useClientConfig()
  const discoveryServiceUrl = envConfig.isDocker
    ? window.location.origin
    : envConfig.discoveryServiceUrl
  return useBaseClient(`${discoveryServiceUrl}/api/v2`)
}
