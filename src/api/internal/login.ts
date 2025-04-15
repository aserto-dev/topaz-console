import { useMutation } from '@tanstack/react-query'

import { useClientConfig } from '../../services/EnvConfigProvider'
import { useBaseClient } from '../clients/base'

export const useTopazLogin = () => {
  const { discoveryServiceUrl } = useClientConfig()
  const { get } = useBaseClient(discoveryServiceUrl)


  return useMutation({
    mutationFn: (body: { apiKey: string }) => {
      return get({ headerOverrides: { authorization: `Basic ${body.apiKey}` }, path: `api/v2/config` })
    },
    onSuccess: () => {
      window.location.reload();
    }
  })
}
