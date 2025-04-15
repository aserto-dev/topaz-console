import { useCallback, useEffect } from 'react'

type Props = {
  fetchNextData: () => void
  hasMoreData: boolean
  isFetching: boolean
}

export const useIsScrollable = ({ fetchNextData, hasMoreData, isFetching }: Props) => {
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
