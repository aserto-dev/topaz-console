import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { RpcStatus } from "../../types/directory"
import { Configurations, QueryKeys } from "../../types/general"
import { useInternalConfigClient } from "../clients/InternalConfigClient"

export const useInternalConfig = (
  options?: Omit<
    UseQueryOptions<Configurations, RpcStatus, Configurations, QueryKeys[]>,
    'queryFn' | 'queryKey' | 'retry' | 'staleTime'
  >
) => {
  const { get } = useInternalConfigClient()

  return useQuery({
    queryFn: () => get<Configurations>({ path: 'config' }),
    queryKey: [QueryKeys.Config],
    ...options,
    enabled: options?.enabled,
    retry: false,
    staleTime: Infinity,
  })
}
