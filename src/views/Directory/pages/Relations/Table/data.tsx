import React, { useMemo, useState } from 'react'

import { keepPreviousData } from '@tanstack/react-query'
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  getNextPage,
  useDirectoryV3ObjectTypesList,
  useDirectoryV3RelationTypesList,
} from '../../../../../api/directory/customQuery'
import { useDirectoryReaderV3RelationsListInfinite } from '../../../../../api/v3/directory'
import NoObjectsImage from '../../../../../assets/shapes.svg'
import DataTable from '../../../../../components/common/DataTable'
import { useFetchMoreOnBottomReached } from '../../../../../components/common/DataTable/hooks'
import EmptyTablePlaceholder from '../../../../../components/common/EmptyTablePlaceholder'
import Select from '../../../../../components/common/Select'
import { Link } from '../../../../../components/common/UndecoratedLink'
import { useDirectoryDataContext } from '../../../../../services/DirectoryContextProvider/hooks'
import { V3Relation } from '../../../../../types/directory'
import {
  BreakDiv,
  EmptyTableContainer,
  FilterInput,
  ObjectIdContainer,
  ObjectTypeContainer,
  RelationsContainer,
  SubjectIdContainer,
  SubjectRelationContainer,
  SubjectTypeContainer,
  TableWrapper,
} from '../styles'

const RelationsTable: React.FC = () => {
  const {
    objectId,
    objectType,
    relation,
    setObjectId,
    setObjectType,
    setRelation,
    setSubjectId,
    setSubjectRelation,
    setSubjectType,
    subjectId,
    subjectRelation,
    subjectType,
  } = useDirectoryDataContext()

  const { data: objectTypesData } = useDirectoryV3ObjectTypesList()
  const { data: objectRelationTypesData } = useDirectoryV3RelationTypesList({
    objectType: objectType,
  })

  const { data: subjectRelationTypesData } = useDirectoryV3RelationTypesList({
    objectType: subjectType,
  })

  const objectTypeOptions = useMemo(() => {
    return [{ label: 'All', value: '' }].concat(
      (objectTypesData?.results || []).map((objectType) => {
        return {
          label: objectType.displayName || objectType.name,
          value: objectType.name,
        }
      }),
    )
  }, [objectTypesData?.results])

  const objectRelationTypeOptions = useMemo(() => {
    return [{ label: 'All', value: '' }].concat(
      (objectRelationTypesData?.results || []).map((relationType) => {
        return {
          label: relationType.displayName || relationType.name,
          value: relationType.name,
        }
      }),
    )
  }, [objectRelationTypesData?.results])

  const subjectRelationTypeOptions = useMemo(() => {
    return [{ label: 'All', value: '' }].concat(
      (subjectRelationTypesData?.results || []).map((relationType) => {
        return {
          label: relationType.displayName || relationType.name,
          value: relationType.name,
        }
      }),
    )
  }, [subjectRelationTypesData?.results])

  const [isFilter, setIsFilter] = useState(true)

  const {
    data: relationsData,
    fetchNextPage: fetchMoreRelations,
    hasNextPage: hasMoreRelations,
    isFetching: isFetchingRelations,
  } = useDirectoryReaderV3RelationsListInfinite(
    {
      object_id: objectId || '',
      object_type: objectType || '',
      'page.size': 100,
      relation: relation || '',
      subject_id: subjectId || '',
      subject_relation: subjectRelation || '',
      subject_type: subjectType || '',
    },
    {
      query: {
        enabled: isFilter,
        getNextPageParam: getNextPage,
        placeholderData: keepPreviousData,
      },
    },
  )

  const relations: V3Relation[] = useMemo(() => {
    return (
      relationsData?.pages.map((relation) => relation.results || []).flat() ||
      []
    )
  }, [relationsData?.pages])

  const columns: ColumnDef<V3Relation>[] = [
    {
      accessorKey: 'object_type',
      header: 'Object Type',
      meta: {
        filter: (
          <ObjectTypeContainer key="object_type">
            <Select
              defaultValue={{ label: 'All', value: '' }}
              label="Object Type"
              options={objectTypeOptions}
              value={objectTypeOptions.find(
                (option) => option.value === objectType || '',
              )}
              onChange={(option) => {
                if (option?.value !== '') {
                  setObjectType(String(option?.value))
                  setRelation('')
                } else {
                  setObjectType(undefined)
                  setRelation('')
                  setObjectId('')
                }
                setIsFilter(true)
              }}
            />
          </ObjectTypeContainer>
        ),
      },
      size: 180,
    },
    {
      accessorKey: 'object_id',
      cell: ({ row }) => {
        return (
          <Link
            to={`/ui/directory/objects/${row.original.object_type}/${encodeURIComponent(
              row.original.object_id,
            )}`}
          >
            <BreakDiv>{row.original.object_id}</BreakDiv>
          </Link>
        )
      },
      header: 'Object Id',
      meta: {
        filter: (
          <ObjectIdContainer key="object_id">
            <FilterInput
              disabled={!objectType || objectType === ''}
              label="Object Id"
              placeholder=""
              value={objectId || ''}
              onChange={(e: { target: { value: string } }) => {
                setIsFilter(false)
                setObjectId(e.target.value)
              }}
              onClickSearch={() => {
                setIsFilter(true)
              }}
            ></FilterInput>
          </ObjectIdContainer>
        ),
      },
      size: 180,
    },
    {
      accessorKey: 'relation',
      id: 'Relation',
      meta: {
        filter: (
          <RelationsContainer key="object_relation">
            <Select
              defaultValue={{ label: 'All', value: '' }}
              disabled={!objectType || objectType === ''}
              label="Object Relation"
              options={objectRelationTypeOptions}
              value={objectRelationTypeOptions.find(
                (option) => option.value === relation || '',
              )}
              onChange={(option) => {
                setRelation(String(option?.value))
                setIsFilter(true)
              }}
            />
          </RelationsContainer>
        ),
      },
      size: 180,
    },
    {
      accessorKey: 'subject_type',
      id: 'Subject Type',
      meta: {
        filter: (
          <SubjectTypeContainer key="subject_type">
            <Select
              defaultValue={{ label: 'All', value: '' }}
              label="Subject Type"
              options={objectTypeOptions}
              value={objectTypeOptions.find(
                (option) => option.value === (subjectType || ''),
              )}
              onChange={(option) => {
                if (option?.value !== '') {
                  setSubjectType(String(option?.value))
                  setSubjectRelation(undefined)
                } else {
                  setSubjectType(undefined)
                  setSubjectRelation(undefined)
                  setSubjectId('')
                }
                setIsFilter(true)
              }}
            />
          </SubjectTypeContainer>
        ),
      },
      size: 180,
    },
    {
      accessorKey: 'subject_id',
      cell: ({ row }) => {
        return (
          <Link
            to={`/ui/directory/objects/${row.original.subject_type}/${encodeURIComponent(
              row.original.subject_id,
            )}`}
          >
            <BreakDiv>{row.original.subject_id}</BreakDiv>
          </Link>
        )
      },
      id: 'Subject Id',
      meta: {
        filter: (
          <SubjectIdContainer key="subject_id">
            <FilterInput
              disabled={!subjectType || subjectType === ''}
              label="Subject Id"
              placeholder=""
              value={subjectId || ''}
              onChange={(e: { target: { value: string } }) => {
                setIsFilter(false)
                setSubjectId(e.target.value)
              }}
              onClickSearch={() => {
                setIsFilter(true)
              }}
            ></FilterInput>
          </SubjectIdContainer>
        ),
      },
      size: 180,
    },
    {
      accessorKey: 'subject_relation',
      id: 'Subject Relation',
      meta: {
        filter: (
          <SubjectRelationContainer key="subject_relation">
            <Select
              defaultValue={{ label: 'All', value: '' }}
              disabled={!subjectType || subjectType === ''}
              label="Subject Relation"
              options={subjectRelationTypeOptions}
              value={subjectRelationTypeOptions.find(
                (option) => option.value === (subjectRelation || ''),
              )}
              onChange={(option) => {
                if (option?.value !== '') {
                  setSubjectRelation(String(option?.value))
                } else {
                  setSubjectRelation(undefined)
                }
                setIsFilter(true)
              }}
            />
          </SubjectRelationContainer>
        ),
      },
      size: 180,
    },
  ]

  const table = useReactTable({
    columns: columns,
    data: relations,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualFiltering: true,
  })

  const fetchMoreOnBottomReached = useFetchMoreOnBottomReached({
    getNext: fetchMoreRelations,
    hasMore: hasMoreRelations,
  })

  return (
    <>
      {isFetchingRelations || !!relations.length || isFilter ? (
        <TableWrapper>
          <DataTable
            fetchMoreOnBottomReached={fetchMoreOnBottomReached}
            isFetching={isFetchingRelations}
            table={table}
            topDistance={150}
          />
        </TableWrapper>
      ) : (
        <EmptyTableContainer>
          <EmptyTablePlaceholder
            body=""
            header="No relations"
            imgAlt="Empty Directory"
            imgSrc={NoObjectsImage}
          />
        </EmptyTableContainer>
      )}
    </>
  )
}

export default RelationsTable
