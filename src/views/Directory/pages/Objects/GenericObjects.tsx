import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

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
import { useFetchMoreOnBottomReached } from '../../../../components/common/DataTable/hooks'
import EmptyTablePlaceholder from '../../../../components/common/EmptyTablePlaceholder'
import { Link } from '../../../../components/common/UndecoratedLink'
import { V3Object } from '../../../../types/directory'
import ObjectsHeader from './ObjectsHeader'
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

const Objects: React.FC = () => {
  const { objectType: objectTypeName } = useParams()
  const safeObjectType = objectTypeName || ''
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

  const [objects, setObjects] = useState<V3Object[]>([])

  const listObjects = useMemo(() => {
    const objects =
      objectsData?.pages.map((page) => page.results || []).flat() ?? []
    setObjects(objects)
    return objects
  }, [objectsData?.pages, setObjects])

  const columns: ColumnDef<V3Object>[] = [
    {
      cell: ({ row }) => {
        return <BreakDiv>{row.original.id}</BreakDiv>
      },
      header: 'ID',
      size: 500,
    },

    {
      cell: ({ row }) => {
        return (
          <Link
            to={`/ui/directory/objects/${safeObjectType}/${encodeURIComponent(row.original.id)}`}
          >
            <BreakDiv>{row.original.display_name || row.original.id}</BreakDiv>
          </Link>
        )
      },
      header: 'Name',
      size: 500,
    },
  ]

  const table = useReactTable({
    columns: columns,
    data: objects,
    getCoreRowModel: getCoreRowModel(),
  })

  const fetchMoreOnBottomReached = useFetchMoreOnBottomReached({
    getNext: fetchMoreObjects,
    hasMore: hasMoreObjects,
  })

  if (isFetchingObjects) {
    return null
  }

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
              onClick={async () => {
                const data = (await refetchObject()).data
                const result = data?.result ? [data.result] : []
                setObjects(result)
              }}
            >
              &nbsp;Find&nbsp;
            </FindButton>
          </>
        </ObjectsHeader>
        {objects.length ? (
          <DataTable
            fetchMoreOnBottomReached={fetchMoreOnBottomReached}
            isFetching={isFetchingObjects}
            table={table}
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
