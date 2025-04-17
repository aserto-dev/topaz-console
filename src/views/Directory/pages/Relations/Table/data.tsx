import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { keepPreviousData } from '@tanstack/react-query'
import {
  ColumnDef,
  getCoreRowModel,
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
import EmptyTablePlaceholder from '../../../../../components/common/EmptyTablePlaceholder'
import Select from '../../../../../components/common/Select'
import { Link } from '../../../../../components/common/UndecoratedLink'
import { useDirectoryDataContext } from '../../../../../services/DirectoryContextProvider/hooks'
import { V3Relation } from '../../../../../types/directory'
import { useIsScrollable } from '../../Directory/useIsScrollable'
import {
  BreakDiv,
  EmptyTableContainer,
  FieldsContainer,
  FilterInput,
  Label,
  LabelContainer,
  ObjectContainer,
  ObjectIdContainer,
  ObjectTypeContainer,
  RelationsContainer,
  SelectContainer,
  SubjectContainer,
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

  const [relationsList, setRelationsList] = useState<V3Relation[]>([])

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
      'page.size': 5,
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

  useEffect(() => {
    setRelationsList(relations)
  }, [relations])

  useEffect(() => {
    setIsFilter(false)
  }, [setIsFilter])

  const fetchData = useIsScrollable({
    fetchNextData: fetchMoreRelations,
    hasMoreData: hasMoreRelations || false,
    isFetching: isFetchingRelations,
  })

  useCallback(() => {
    fetchData()
  }, [fetchData])

  const columns: ColumnDef<V3Relation>[] = useMemo(() => {
    return [
      {
        accessorKey: 'object_type',
        size: 16,
      },
      {
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
        id: 'Object Id',
      },
      {
        accessorKey: 'relation',
      },
      {
        cell: () => {
          return <div></div>
        },
        id: 'delimiter',
        size: 2,
      },
      {
        cell: () => {
          return <div></div>
        },
        id: 'blank',
        size: 8,
      },
      {
        accessorKey: 'subject_type',
      },
      {
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
      },
      {
        accessorKey: 'subject_relation',
      },
    ]
  }, [])

  const table = useReactTable({
    columns: columns,
    data: relationsList,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <SelectContainer>
        <ObjectContainer>
          <Label>Object</Label>
          <FieldsContainer>
            <ObjectTypeContainer>
              <Select
                defaultValue={{ label: 'All', value: '' }}
                label="Type"
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
            <ObjectIdContainer>
              <FilterInput
                disabled={!objectType || objectType === ''}
                label="Id"
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
            <RelationsContainer>
              <Select
                defaultValue={{ label: 'All', value: '' }}
                disabled={!objectType || objectType === ''}
                label="Relation"
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
          </FieldsContainer>
        </ObjectContainer>
        <SubjectContainer>
          <LabelContainer>
            <Label>Subject</Label>
          </LabelContainer>
          <FieldsContainer>
            <SubjectTypeContainer>
              <Select
                defaultValue={{ label: 'All', value: '' }}
                label="Type"
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
            <SubjectIdContainer>
              <FilterInput
                disabled={!subjectType || subjectType === ''}
                label="Id"
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
            <SubjectRelationContainer>
              <Select
                defaultValue={{ label: 'All', value: '' }}
                disabled={!subjectType || subjectType === ''}
                label="Relation"
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
          </FieldsContainer>
        </SubjectContainer>
      </SelectContainer>
      {isFetchingRelations || !!relations.length ? (
        <TableWrapper>
          <DataTable table={table} />
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
