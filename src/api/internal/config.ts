import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Configurations, QueryKeys } from "../../types/general"
import { RpcStatus } from "../../types/directory"
import { useInternalConfigClient } from "../clients/InternalConfigClient"

export const useInternalConfig = (
  options?: Omit<
    UseQueryOptions<Configurations, RpcStatus, Configurations, QueryKeys[]>,
    'queryKey' | 'queryFn' | 'retry' | 'staleTime'
  >
) => {
  const { get } = useInternalConfigClient()

  return useQuery({
    queryKey: [QueryKeys.Config],
    queryFn: () => get<Configurations>({ path: 'config' }),
    ...options,
    enabled: options?.enabled,
    retry: false,
    staleTime: Infinity,
  })
}
