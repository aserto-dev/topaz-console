import { useMutation } from '@tanstack/react-query'

import { useBaseClient } from '../clients/base'
import { useClientConfig } from '../../services/EnvConfigProvider'

export const useTopazLogin = () => {
  const { discoveryServiceUrl } = useClientConfig()
  const { get } = useBaseClient(discoveryServiceUrl)


  return useMutation({
    mutationFn: (body: {apiKey: string}) => {
      return get({ path: `api/v2/config`, headerOverrides: { authorization: `Basic ${body.apiKey}` } })
    },
    onSuccess: () => {
      window.location.reload();
    }
  })
}
