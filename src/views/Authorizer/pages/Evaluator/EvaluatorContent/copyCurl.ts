import copy from 'copy-to-clipboard'
import { useCallback } from 'react'

import { useConfig } from '../../../../../services/ConfigProvider/hooks'



export const useCopyCurl = (payload?: string, path?: string) => {
  const { authorizerApiKey, authorizerServiceUrl } = useConfig()

  const authorization = authorizerApiKey ? `basic ${authorizerApiKey}` : ''

  const request = useCallback(() => {
    return `curl '${authorizerServiceUrl}/${path}' \\
  -H 'authorization: ${authorization}' \\
  -H 'content-type: application/json' \\
  --data-raw '${payload}' \\
  `
  }, [authorizerServiceUrl, authorization, payload, path])

  return { copyCurl: () => copy(request()) }
}
