import { useCallback, useEffect } from 'react'

type Props = {
  isFetching: boolean
  hasMoreData: boolean
  fetchNextData: () => void
}

export const useIsScrollable = ({ isFetching, hasMoreData, fetchNextData }: Props) => {
  const fetchData = useCallback(() => {
    fetchNextData()
  }, [fetchNextData])

  useEffect(() => {
    if (document.body.scrollHeight <= document.body.clientHeight && !isFetching && hasMoreData) {
      setTimeout(() => {
        fetchData()
      }, 100)
    }
  }, [fetchData, fetchNextData, isFetching, hasMoreData])

  return fetchData
}
