import { useCallback } from 'react'

type PagingConfig = {
  getNext: () => void
  hasMore: boolean
}

export const useFetchMoreOnBottomReached = (paging: PagingConfig) => {
  return useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { clientHeight, scrollHeight, scrollTop } = containerRefElement
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (scrollHeight - scrollTop - clientHeight < 500 && paging.hasMore) {
          paging.getNext()
        }
      }
    },
    [paging],
  )
}
