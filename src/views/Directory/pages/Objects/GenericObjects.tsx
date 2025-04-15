import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { CellProps, Column } from 'react-table'
import styled from 'styled-components'

import NoObjectsImage from '../../../../assets/shapes.svg'
import DataTable from '../../../../components/common/DataTable'
import EmptyTablePlaceholder from '../../../../components/common/EmptyTablePlaceholder'
import { V3Object } from '../../../../types/directory'
import { Link } from '../../../../components/common/UndecoratedLink'
import ObjectsHeader from './ObjectsHeader'
import { useIsScrollable } from './useIsScrollable'
import { FindButton, PageHeaderInput } from './UserObjects/styles'
import {
  useDirectoryReaderV3ObjectGet,
  useDirectoryReaderV3ObjectsListInfinite,
} from '../../../../api/v3/directory'
import {
  getNextPage,
  useDirectoryV3ObjectTypesList,
} from '../../../../api/directory/customQuery'

const Container = styled.div`
  width: 100%;
  @media (max-width: 912px) {
    margin-top: 94px;
  }
`
const BreakDiv = styled.div`
  word-break: break-all;
`
type ObjectSummary = {
  key: string
  name?: string | undefined | null
}

const Objects: React.FC = () => {
  const { objectType: objectTypeName } = useParams()
  const safeObjectType = objectTypeName || ''
  const [objects, setObjects] = useState<V3Object[]>([])
  const [searchKey, setSearchKey] = useState<string>('')

  const { data } = useDirectoryV3ObjectTypesList()
  const objectTypes = useMemo(() => {
    return (data?.results || []).map((o) => o.name)
  }, [data?.results])

  const {
    data: objectsData,
    isFetching: isFetchingObjects,
    hasNextPage: hasMoreObjects,
    fetchNextPage: fetchMoreObjects,
  } = useDirectoryReaderV3ObjectsListInfinite(
    {
      object_type: objectTypeName,
      'page.size': 100,
    },
    {
      query: {
        getNextPageParam: getNextPage,
        enabled: objectTypes.includes(safeObjectType),
      },
    },
  )

  const { refetch: refetchObject } = useDirectoryReaderV3ObjectGet(
    safeObjectType,
    searchKey,
    {},
    {
      query: {
        enabled: false,
        retry: false,
        meta: {
          showError: false,
        },
      },
    },
  )

  const listObjects = useMemo(
    () => objectsData?.pages.map((page) => page.results || []).flat() ?? [],
    [objectsData?.pages],
  )

  useEffect(() => {
    setObjects(listObjects)
  }, [listObjects])

  const fetchData = useIsScrollable({
    isFetching: isFetchingObjects,
    hasMoreData: hasMoreObjects || false,
    fetchNextData: fetchMoreObjects,
  })
  useCallback(() => {
    fetchData()
  }, [fetchData])
  const columns: Column<ObjectSummary>[] = [
    {
      Header: 'ID',
      style: {
        cellWidth: '50%',
      },
      Cell: ({ row }: CellProps<ObjectSummary>) => {
        return <BreakDiv>{row.original.key}</BreakDiv>
      },
    },

    {
      Header: 'Name',
      style: {
        cellWidth: '50%',
      },

      Cell: ({ row }: CellProps<ObjectSummary>) => {
        return (
          <Link
            to={`/ui/directory/objects/${safeObjectType}/${encodeURIComponent(row.original.key)}`}
          >
            <BreakDiv>{row.original.name}</BreakDiv>
          </Link>
        )
      },
    },
  ]

  return (
    <>
      <Container>
        <ObjectsHeader>
          <>
            <PageHeaderInput
              data-testid="filter-input"
              placeholder="Find"
              value={searchKey}
              onChange={(e: { target: { value: string } }) => {
                if (e.target.value === '' || e.target.value === undefined) {
                  setObjects(listObjects)
                }
                setSearchKey(e.target.value)
              }}
            />
            <FindButton
              disabled={!searchKey}
              onClick={() => {
                setSearchKey(searchKey)
                refetchObject()
              }}
            >
              &nbsp;Find&nbsp;
            </FindButton>
          </>
        </ObjectsHeader>
        {objects.length ? (
          <DataTable
            columns={columns}
            data={objects.map((object) => {
              return { name: object.display_name || object.id, key: object.id }
            })}
            paging={{
              dataLength: objects.length,
              loadingContent: [
                {
                  key: 'loading...',
                  name: 'loading...',
                },
              ],
              hasMore: () => !!hasMoreObjects,
              getNext: () => fetchMoreObjects(),
            }}
            sticky={true}
          />
        ) : (
          <EmptyTablePlaceholder
            body={`To add one, click the "Add" button in the top left.`}
            header=""
            imgAlt="Empty Directory"
            imgSrc={NoObjectsImage}
          />
        )}
        <br />
      </Container>
      <br />
    </>
  )
}

export default Objects
