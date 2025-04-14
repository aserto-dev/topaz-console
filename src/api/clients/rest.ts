
import { useConfig } from '../../services/ConfigProvider/hooks'
import { BaseClient, useBaseClient } from './base'
import { QueryParams } from './queryParams'

type RestClient<T> = (data: {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD'
  params?: QueryParams
  headers?: Record<string, string>
  data?: unknown
  responseType?: string
  signal?: AbortSignal
}) => Promise<T>

export const useAuthorizerClient = <T>(): RestClient<T> => {
  const { authorizerApiKey, authorizerServiceUrl } = useConfig()
  const headers: Record<string, string> = {}
  if (authorizerApiKey) {
    headers['authorization'] = `basic ${authorizerApiKey}`
  }

  const client = useBaseClient(authorizerServiceUrl!, headers)

  return restClient<T>(client)
}

const useRestDirectoryClient = <T>(directoryServiceUrl: string): RestClient<T> => {
  const { directoryApiKey } = useConfig()
  const headers: Record<string, string> = {}
  if (directoryApiKey) {
    headers['authorization'] = `basic ${directoryApiKey}`
  }

  const client = useBaseClient(directoryServiceUrl, headers)

  return restClient<T>(client)
}


export const useDirectoryReaderClient = <T>(): RestClient<T> => {
  const { directoryReaderServiceUrl, directoryServiceUrl } = useConfig()
  return useRestDirectoryClient(directoryReaderServiceUrl || directoryServiceUrl || '')
}

export const useDirectoryWriterClient = <T>(): RestClient<T> => {
  const { directoryWriterServiceUrl, directoryServiceUrl } = useConfig()
  return useRestDirectoryClient(directoryWriterServiceUrl || directoryServiceUrl || '')
}

export const useDirectoryModelClient = <T>(): RestClient<T> => {
  const { directoryModelServiceUrl, directoryServiceUrl } = useConfig()
  return useRestDirectoryClient(directoryModelServiceUrl || directoryServiceUrl || '')
}
function restClient<T>(client: BaseClient): RestClient<T> {
  return async ({ url, method, params, data, signal, responseType }) => {
    const path = url.replace('/', '')
    const queryParams = params
    if (queryParams && queryParams['page.token'] === undefined) {
      delete queryParams['page.token']
    }
    const body = data as T
    const abortSignal = signal

    switch (method.toUpperCase()) {
      case 'GET':
        if (responseType === 'blob') {
          return (await client.getBlob<T>({
            abortSignal,
            path,
            queryParams,
          })) as T
        }
        return await client.get<T>({
          abortSignal,
          path,
          queryParams,
        })

      case 'POST':
        if (responseType === 'blob' || path.startsWith('api/v3/directory/manifest')) {
          return (await client.postBlob<T, T>({
            abortSignal,
            body,
            path,
            queryParams,
          })) as T
        }

        return await client.post<T, T>({
          abortSignal,
          body,
          path,
          queryParams,
        })

      case 'PUT':
        return await client.put<T, T>({
          abortSignal,
          body,
          path,
          queryParams,
        })

      case 'DELETE':
        return await client.del<T>({
          abortSignal,
          path,
          queryParams,
        })

      default:
        return await client.get<T>({
          abortSignal,
          path,
          queryParams,
        })
    }
  }
}

