import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { CellProps, Column } from 'react-table'
import styled from 'styled-components'

import {
  getNextPage,
  useDirectoryV3ObjectTypesList,
} from '../../../../api/directory/customQuery'
import {
  useDirectoryReaderV3ObjectGet,
  useDirectoryReaderV3ObjectsListInfinite,
} from '../../../../api/v3/directory'
import NoObjectsImage from '../../../../assets/shapes.svg'
import DataTable from '../../../../components/common/DataTable'
import EmptyTablePlaceholder from '../../../../components/common/EmptyTablePlaceholder'
import { Link } from '../../../../components/common/UndecoratedLink'
import { V3Object } from '../../../../types/directory'
import ObjectsHeader from './ObjectsHeader'
import { useIsScrollable } from './useIsScrollable'
import { FindButton, PageHeaderInput } from './UserObjects/styles'

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
  name?: null | string | undefined
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
    fetchNextPage: fetchMoreObjects,
    hasNextPage: hasMoreObjects,
    isFetching: isFetchingObjects,
  } = useDirectoryReaderV3ObjectsListInfinite(
    {
      object_type: objectTypeName,
      'page.size': 100,
    },
    {
      query: {
        enabled: objectTypes.includes(safeObjectType),
        getNextPageParam: getNextPage,
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
        meta: {
          showError: false,
        },
        retry: false,
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
    fetchNextData: fetchMoreObjects,
    hasMoreData: hasMoreObjects || false,
    isFetching: isFetchingObjects,
  })
  useCallback(() => {
    fetchData()
  }, [fetchData])
  const columns: Column<ObjectSummary>[] = [
    {
      Cell: ({ row }: CellProps<ObjectSummary>) => {
        return <BreakDiv>{row.original.key}</BreakDiv>
      },
      Header: 'ID',
      style: {
        cellWidth: '50%',
      },
    },

    {
      Cell: ({ row }: CellProps<ObjectSummary>) => {
        return (
          <Link
            to={`/ui/directory/objects/${safeObjectType}/${encodeURIComponent(row.original.key)}`}
          >
            <BreakDiv>{row.original.name}</BreakDiv>
          </Link>
        )
      },
      Header: 'Name',

      style: {
        cellWidth: '50%',
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
              return { key: object.id, name: object.display_name || object.id }
            })}
            paging={{
              dataLength: objects.length,
              getNext: () => fetchMoreObjects(),
              hasMore: () => !!hasMoreObjects,
              loadingContent: [
                {
                  key: 'loading...',
                  name: 'loading...',
                },
              ],
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
