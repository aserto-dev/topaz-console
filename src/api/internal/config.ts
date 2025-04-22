import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { RpcStatus } from "../../types/directory"
import { Configurations, QueryKeys } from "../../types/general"
import { useConfigClient } from "../clients/configClient"

export const useTopazConfig = (
  options?: Omit<
    UseQueryOptions<Configurations, RpcStatus, Configurations, QueryKeys[]>,
    'queryFn' | 'queryKey' | 'retry' | 'staleTime'
  >
) => {
  const { get } = useConfigClient()
  return useQuery({
    queryFn: () => get<Configurations>({ path: 'config' }),
    queryKey: [QueryKeys.Config],
    ...options,
    enabled: options?.enabled,
    retry: false,
    staleTime: Infinity,
  })
}
