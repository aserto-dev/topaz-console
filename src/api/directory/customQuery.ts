import { useMemo } from 'react'
import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'

import { RpcStatus, V3CheckRequest, V3CheckResponse, V3PaginationResponse } from '../../types/directory'
import { useParsedManifest } from './parsers/manifest'
import {
  Permission,
  RelationType,
  V3GetObjectTypesResponse,
  V3GetPermissionsResponse,
  V3GetRelationTypesResponse,
  V3ObjectTypesListRequest,
  V3PermissionsListRequest,
  V3RelationTypesListRequest,
} from './types'
import { useDirectoryReaderClient } from '../clients/rest'

export const useDirectoryV3CheckQuery = (
  params: V3CheckRequest,
  options?: Omit<
    UseQueryOptions<V3CheckResponse, RpcStatus, V3CheckResponse, QueryKey>,
    'queryKey' | 'queryFn' | 'retry' | 'staleTime'
  >
) => {
  const directoryV3Check = useDirectoryReaderClient<V3CheckResponse>()

  return useQuery({
    queryKey: ['check', params],
    queryFn: (): Promise<V3CheckResponse> => {
      return directoryV3Check({
        url: `/api/v3/directory/check`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: params,
      })
    },
    ...options,
  })
}

export const useDirectoryV3ObjectTypesList = (params?: V3ObjectTypesListRequest) => {
  const { objectTypes, promise, ...all } = useParsedManifest()
  const results = useMemo(() => {
    return objectTypes && params?.name
      ? objectTypes.filter((objectType) => objectType.name === params.name)
      : objectTypes
  }, [objectTypes, params])

  const newPromise = new Promise<V3GetObjectTypesResponse>((resolve) => {
    resolve({results: objectTypes})
  })

  return {
    data: { results },
    promise:  newPromise ||  promise,
    ...all,
  }
}

export const useDirectoryV3RelationTypesList = (params?: V3RelationTypesListRequest) => {
  const { relationTypes, promise, ...all } = useParsedManifest()
  const { objectType, name } = params ?? {}

  const filteredRelationTypes = useMemo(() => {
    let filteredRelationTypes: RelationType[] = relationTypes
    if (objectType) {
      filteredRelationTypes = relationTypes.filter(
        (relationType) => relationType.objectType === objectType
      )
    }
    if (name) {
      filteredRelationTypes = relationTypes.filter((relationType) => relationType.name === name)
    }

    return filteredRelationTypes
  }, [name, objectType, relationTypes])

  const newPromise = new Promise<V3GetRelationTypesResponse>((resolve) => {
    resolve({results: filteredRelationTypes})
  })

  return {
    data: {
      results: filteredRelationTypes,
    },
    promise: newPromise || promise,
    ...all,
  }
}

export const useDirectoryV3PermissionsList = (params?: V3PermissionsListRequest) => {
  const { permissions, promise, ...all } = useParsedManifest()
  const { objectType, name } = params ?? {}

  const filteredPermissions = useMemo(() => {
    let filteredPermissions: Permission[] = permissions
    if (objectType) {
      filteredPermissions = permissions.filter((permission) => permission.objectType === objectType)
    }
    if (name) {
      filteredPermissions = permissions.filter((permission) => permission.name === name)
    }

    return filteredPermissions
  }, [name, objectType, permissions])

  const newPromise = new Promise<V3GetPermissionsResponse>((resolve) => {
    resolve({results: filteredPermissions})
  })
  return {
    data: {
      results: filteredPermissions,
    },
    promise: newPromise || promise,
    ...all,
  }
}

export const getNextPage = (lastPage: { page?: V3PaginationResponse  | undefined}) => {
  return lastPage?.page?.next_token || undefined
}
