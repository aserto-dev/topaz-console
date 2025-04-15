import copy from 'copy-to-clipboard'
import { useCallback } from 'react'

import { RequestPayload } from '.'
import { useConfig } from '../../../../services/ConfigProvider/hooks'

export const useCopyCurlRest = (request: string, requestData: RequestPayload, path: string) => {
  const { directoryApiKey, directoryServiceUrl } = useConfig()



  const authorization = directoryApiKey ? `basic ${directoryApiKey}` : undefined

  const req = useCallback(() => {
    const curl = (options: { params?: string; payload?: string }) => {
      return `curl '${directoryServiceUrl}/${path}${options.params ? `${options.params}` : ''}' \\
          -H 'authorization: ${authorization}' \\
          -H 'content-type: application/json' \\
          ${options.payload ? `--data-raw '${options.payload}'` : ''}`
    }

    const checkCurl = () => {
      return curl({ payload: JSON.stringify(requestData) })
    }

    const objectsCurl = () => {
      return curl({
        params: `?object_type=${requestData.object_type}`,
      })
    }

    const relationsCurl = () => {
      const subjectCurl = curl({
        params: `?subject_id=${encodeURIComponent(requestData.object_id)}&subject_type=${
          requestData.object_type
        }`,
      })

      const objectCurl = curl({
        params: `?object_id=${encodeURIComponent(requestData.object_id)}&object_type=${
          requestData.object_type
        }`,
      })
      return `${objectCurl} && ${subjectCurl}`
    }

    const objectCurl = () => {
      return curl({
        params: `/${requestData.object_type}/${encodeURIComponent(requestData.object_id)}`,
      })
    }

    const getGraphCurl = () => {
      return curl({
        params: `/${requestData.object_type}/${requestData.relation}/${
          requestData.subject_type
        }?object_id=${encodeURIComponent(
          requestData.object_id || ''
        )}&subject_id=${encodeURIComponent(requestData.subject_id || '')}`,
      })
    }

    switch (request) {
      case 'check':
        return checkCurl()
      case 'find_objects':
        return getGraphCurl()
      case 'find_users':
        return getGraphCurl()
      case 'objects':
        return objectsCurl()
      case 'relations':
        return relationsCurl()
      default:
        return objectCurl()
    }
  }, [request, directoryServiceUrl, path, requestData, authorization])

  return {
    copyCurlRest: () => copy(req()),
  }
}
