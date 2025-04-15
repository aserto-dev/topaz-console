import { useCallback, useMemo } from 'react'


import { flatten, QueryParams } from './queryParams'
import ensureError from '../../lib/error/ensureError'

type FetchParams = {
  abortSignal?: AbortSignal | null
  headerOverrides?: Record<string, string>
  path: string
  queryParams?: QueryParams
}

type FetchParamsWithBody<T> = FetchParams & {
  body: T
}

export type BaseClient = {
  del: <T>(params: FetchParams) => Promise<T>;
  get: <T>(params: FetchParams) => Promise<T>;
  getBlob: <T>(params: FetchParams) => Promise<T>;
  patch: <Tout, Tin>(params: FetchParamsWithBody<Tin>) => Promise<Tout>;
  post: <Tout, Tin>(params: FetchParamsWithBody<Tin>) => Promise<Tout>;
  postBlob: <Tout, Tin>(params: FetchParamsWithBody<Tin>) => Promise<Tout>;
  put: <Tout, Tin>(params: FetchParamsWithBody<Tin>) => Promise<Tout>;
};
export const useBaseClient = (
  baseUrl: string,
  apiHeaderOverrides: Record<string, string> = {},
  getAuthorizationHeaderValue?: () => Promise<string | void>,
  onUnauthorized?: () => void
) => {
  const generateHeaders = useCallback(
    async (headerOverrides: Record<string, string> = {}) => {
      const headers: Record<string, string> = {
        ...(getAuthorizationHeaderValue
          ? { Authorization: `${await getAuthorizationHeaderValue()}` }
          : {}),
        'Content-Type': 'application/json',
      }



      Object.assign(headers, apiHeaderOverrides, headerOverrides)

      return headers
    },
    [getAuthorizationHeaderValue, apiHeaderOverrides]
  )

  const logoutIfUnauthorized = useCallback(
    (status: number): void => {
      // check for an unauthorized status, which indicates an expired token
      if (status === 401) {
        onUnauthorized?.()
      }
    },
    [onUnauthorized]
  )


  const fetchFromApi = useCallback(
    async (
      method: string,
      path: string,
      queryParams: Record<string, string> = {},
      body: RequestInit['body'] = undefined,
      headerOverrides: Record<string, string> = {},
      abortSignal: AbortSignal | null | undefined
    ) => {
      const [headers] = await Promise.all([generateHeaders(headerOverrides)])
      const queryPart =
        !!queryParams && Object.keys(queryParams).length > 0
          ? `?${new URLSearchParams(queryParams)}`
          : ''

      let url = baseUrl
      if (path !== '') {
        url = `${baseUrl}/${path}${queryPart}`
      }

      const response = await fetch(url, {
        method: method || 'GET',
        headers,
        body,
        signal: abortSignal,
      })

      if (!response.ok) {
        let error = ensureError(`${response.status}: ${response.statusText} from ${method} ${url}`)

        try {
          error = ensureError(await response.json())
        } catch { /* empty */ }

        throw error
      }
      logoutIfUnauthorized(response.status)
      return response
    },
    [baseUrl, generateHeaders, logoutIfUnauthorized]
  )

  type FetchParams = {
    abortSignal?: AbortSignal | null
    headerOverrides?: Record<string, string>
    path: string
    queryParams?: QueryParams
  }

  type FetchParamsWithBody<T> = FetchParams & {
    body: T
  }

  return useMemo(
    () => ({
      del: async <T>({ abortSignal, headerOverrides = {}, path, queryParams }: FetchParams) => {
        const response = await fetchFromApi(
          'DELETE',
          path,
          flatten(queryParams!),
          undefined,
          headerOverrides,
          abortSignal
        )
        return response.json() as Promise<T>
      },

      get: async <T>({ abortSignal, headerOverrides = {}, path, queryParams }: FetchParams) => {
        const response = await fetchFromApi(
          'GET',
          path,
          flatten(queryParams!),
          undefined,
          headerOverrides,
          abortSignal
        )
        return response.json() as Promise<T>
      },

      getBlob: async <T>({ abortSignal, headerOverrides = {}, path, queryParams }: FetchParams) => {
        const response = await fetchFromApi(
          'GET',
          path,
          flatten(queryParams!),
          undefined,
          headerOverrides,
          abortSignal
        )

        const blob = await response.blob()
        const data = blob.text()
        return data as Promise<T>
      },

      patch: async <Tout, Tin>({
        abortSignal,
        body,
        headerOverrides = {},
        path,
        queryParams,
      }: FetchParamsWithBody<Tin>) => {
        const response = await fetchFromApi(
          'PATCH',
          path,
          flatten(queryParams!),
          JSON.stringify(body),
          headerOverrides,
          abortSignal
        )
        return response.json() as Promise<Tout>
      },

      post: async <Tout, Tin>({
        abortSignal,
        body,
        headerOverrides = {},
        path,
        queryParams,
      }: FetchParamsWithBody<Tin>) => {
        const response = await fetchFromApi(
          'POST',
          path,
          flatten(queryParams!),
          JSON.stringify(body),
          headerOverrides,
          abortSignal
        )

        if (headerOverrides['accept'] === 'application/octet-stream') {
          return response.blob() as Promise<Tout>
        }
        return response.json() as Promise<Tout>
      },

      postBlob: async <Tout, Tin>({
        abortSignal,
        body,
        headerOverrides = {},
        path,
        queryParams,
      }: FetchParamsWithBody<Tin>) => {
        const response = await fetchFromApi(
          'POST',
          path,
          flatten(queryParams!),
          body as Blob,
          headerOverrides,
          abortSignal
        )
        return response.blob() as Promise<Tout>
      },

      put: async <Tout, Tin>({
        abortSignal,
        body,
        headerOverrides = {},
        path,
        queryParams,
      }: FetchParamsWithBody<Tin>) => {
        const response = await fetchFromApi(
          'PUT',
          path,
          flatten(queryParams!),
          JSON.stringify(body),
          headerOverrides,
          abortSignal
        )
        return response.json() as Promise<Tout>
      },
    }),
    [fetchFromApi]
  )
}
