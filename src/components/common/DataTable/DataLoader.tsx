import { PropsWithChildren, ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

export type PagingConfig = {
  dataLength: number
  getNext: () => void
  hasMore: () => boolean
  loader: ReactNode
  scrollableTarget?: ReactNode
}

type DataLoaderProps = PropsWithChildren<{
  paging?: PagingConfig
}>

const DataLoader = ({ children, paging }: DataLoaderProps) => {
  if (!paging) {
    return <>{children}</>
  }

  return (
    <InfiniteScroll
      dataLength={paging.dataLength}
      hasMore={!!paging?.hasMore()}
      loader={paging.loader}
      next={() => paging?.getNext()}
      scrollableTarget={paging.scrollableTarget}
    >
      {children}
    </InfiniteScroll>
  )
}

export default DataLoader
