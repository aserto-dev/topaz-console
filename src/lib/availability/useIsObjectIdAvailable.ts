import { useMemo } from 'react'

import { getNextPage } from '../../api/directory/customQuery'
import { useDirectoryReaderV3ObjectsListInfinite } from '../../api/v3/directory'
import { UseIsNameAvailable } from './useIsAvailable'
import useIsAvailableDebounced from './useIsAvailableDebounced'

const useIsIdAvailable = (objectType: string | undefined, currentId?: string): UseIsNameAvailable =>
  useMemo(() => {
    const useIsObjectTypeKeyAvailable = (id: string) => {
      const queryResult = useDirectoryReaderV3ObjectsListInfinite(
        { object_type: objectType!},
        {
          query: { enabled: !!objectType && id !== currentId, getNextPageParam: getNextPage },
        }
      )

      const response = useMemo(() => {
        const matches =
          queryResult.data?.pages
            .flatMap((page) => page.results || [])
            ?.filter((object) => object.id === id) || []
        const isAvailable =
          !id ||
          id === currentId ||
          queryResult.isFetching ||
          !!queryResult.error ||
          !queryResult.data ||
          matches.length === 0

        return {
          isAvailable: isAvailable,
          reason: isAvailable ? '' : 'That ID is already in use',
        }
      }, [id, queryResult.data, queryResult.error, queryResult.isFetching])

      return response
    }

    const useIsObjectIdAvailableDebounced = (id: string, defaultId: string) => {
      const useRunTarget = () => useIsAvailableDebounced(useIsObjectTypeKeyAvailable)
      const run = useMemo(useRunTarget, [])
      return run(id, defaultId)
    }

    return useIsObjectIdAvailableDebounced
  }, [currentId, objectType])

export default useIsIdAvailable
