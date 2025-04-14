import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CellProps, Column, TableInstance } from 'react-table'

import NoObjectsImage from '../../../../../assets/shapes.svg'
import { useDirectoryDataContext } from '../../../../../services/DirectoryContextProvider/hooks'
import { V3Relation } from '../../../../../types/directory'
import DataTable from '../../../../../components/common/DataTable'
import EmptyTablePlaceholder from '../../../../../components/common/EmptyTablePlaceholder'
import Select from '../../../../../components/common/Select'
import { Link } from '../../../../../components/common/UndecoratedLink'
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
import { useIsScrollable } from '../../Directory/useIsScrollable'
import {
  getNextPage,
  useDirectoryV3ObjectTypesList,
  useDirectoryV3RelationTypesList,
} from '../../../../../api/directory/customQuery'
import { useDirectoryReaderV3RelationsListInfinite } from '../../../../../api/v3/directory'
import { keepPreviousData } from '@tanstack/react-query'

const RelationsTable: React.FC = () => {
  const {
    objectType,
    setObjectType,
    subjectType,
    setSubjectType,
    relation,
    setRelation,
    subjectRelation,
    setSubjectRelation,
    objectId,
    setObjectId,
    subjectId,
    setSubjectId,
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
    isFetching: isFetchingRelations,
    hasNextPage: hasMoreRelations,
    fetchNextPage: fetchMoreRelations,
  } = useDirectoryReaderV3RelationsListInfinite(
    {
      object_type: objectType || '',
      object_id: objectId || '',
      subject_type: subjectType || '',
      subject_id: subjectId || '',
      relation: relation || '',
      subject_relation: subjectRelation || '',
      'page.size': 100,
    },
    {
      query: {
        getNextPageParam: getNextPage,
        enabled: isFilter,
        placeholderData: keepPreviousData,
      },
    },
  )

  const tableRef = useRef<TableInstance<V3Relation> | null>(null)

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
    isFetching: isFetchingRelations,
    hasMoreData: hasMoreRelations || false,
    fetchNextData: fetchMoreRelations,
  })

  useCallback(() => {
    fetchData()
  }, [fetchData])

  const columns: Column<V3Relation>[] = [
    {
      id: 'Object Type',
      style: {
        cellWidth: '16.66%',
      },
      Cell: ({ row }: CellProps<V3Relation>) => {
        return <div>{row.original.object_type}</div>
      },
    },
    {
      id: 'Object Id',
      style: {
        cellWidth: '16.66%',
      },
      Cell: ({ row }: CellProps<V3Relation>) => {
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
    },
    {
      id: 'Relation',
      style: {
        cellWidth: '16.66%',
      },
      Cell: ({ row }: CellProps<V3Relation>) => {
        return <div>{row.original.relation}</div>
      },
    },
    {
      id: 'delimiter',
      style: {
        cellWidth: '2px',
      },
      Cell: () => {
        return <div></div>
      },
    },
    {
      id: 'blank',
      style: {
        cellWidth: '8px',
      },
      Cell: () => {
        return <div></div>
      },
    },
    {
      id: 'Subject Type',
      style: {
        cellWidth: '16.66%',
      },
      Cell: ({ row }: CellProps<V3Relation>) => {
        return <div>{row.original.subject_type}</div>
      },
    },
    {
      id: 'Subject Id',
      style: {
        cellWidth: '16.66%',
      },
      Cell: ({ row }: CellProps<V3Relation>) => {
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
    },
    {
      id: 'Subject Relation',
      style: {
        cellWidth: '16.66%',
      },
      Cell: ({ row }: CellProps<V3Relation>) => {
        return <div>{row.original.subject_relation}</div>
      },
    },
  ]

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
          <DataTable
            columns={columns}
            data={relationsList}
            mRef={tableRef}
            paging={{
              dataLength: relationsList.length,
              loadingContent: [
                {
                  object_type: 'loading...',
                  object_id: 'loading...',
                  relation: 'loading...',
                  subject_type: 'loading...',
                  subject_id: 'loading...',
                  subject_relation: 'loading...',
                },
              ],
              hasMore: () => !!hasMoreRelations,
              getNext: () => fetchMoreRelations(),
            }}
            sticky={true}
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
