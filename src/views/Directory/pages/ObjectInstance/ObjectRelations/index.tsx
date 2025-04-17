import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'

import { useQueryClient } from '@tanstack/react-query'
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  getNextPage,
  useDirectoryV3RelationTypesList,
} from '../../../../../api/directory/customQuery'
import {
  useDirectoryReaderV3RelationsListInfinite,
  useDirectoryWriterV3RelationDelete,
  useDirectoryWriterV3RelationSet,
} from '../../../../../api/v3/directory'
import BinImg from '../../../../../assets/bin.svg'
import plus from '../../../../../assets/plus.svg'
import DataTable from '../../../../../components/common/DataTable'
import EvaluateDisplayState from '../../../../../components/common/EvaluateDisplayState'
import {
  Link,
  UndecoratedLink,
} from '../../../../../components/common/UndecoratedLink'
import {
  useDirectoryDataContext,
  useDirectoryDisplayState,
} from '../../../../../services/DirectoryContextProvider/hooks'
import { useShowError } from '../../../../../services/ErrorModalProvider'
import {
  V3GetRelationsResponseObjects,
  V3Object,
  V3Relation,
} from '../../../../../types/directory'
import { useObjectRelationTypes } from '../../../hooks/useObjectRelationTypes'
import { ImageButton } from '../../../styles'
import {
  AddButton,
  BoldSpan,
  CardDetails,
  ContentContainer,
  EllipsisDiv,
  HighlightedContainer,
  NoRelationText,
  RelationCard,
  RelationCardsContainer,
  RelationsContainer,
  RelationTypesTableContainer,
} from '../styles'
import AddRelationModal from './AddRelationModal'

type RelationCardProp = {
  relation: string
  relationCardDisplayName: string
  relationCardKey: string
  relationCardType: string
  removeRelation: () => void
  subjectRelationName: string
}

type RelationTypeColumn = {
  name: string | undefined
  relationObjectTypeName: string | undefined
}

const ObjectRelations: React.FC<{
  object?: V3Object
  relationSide: 'incoming' | 'outgoing'
}> = ({ object, relationSide }) => {
  const queryClient = useQueryClient()
  const { id: objectId, type: objectType } = object || {}

  const { relationSubject, relationType } = useParams()
  const safeObjectType = objectType || ''
  const safeObjectId = objectId || ''
  const [showAddRelationModal, setShowAddRelationModal] = useState(false)
  const [relationTypesTableData, setRelationTypesTableData] = useState<
    RelationTypeColumn[]
  >([])
  const isOutgoingRelations = useMemo(
    () => relationSide === 'outgoing',
    [relationSide],
  )
  const { relationsQueryKey } = useDirectoryDataContext()
  const showError = useShowError()

  const { data: outgoingRelationsData, queryKey: outgoingRelationsQueryKey } =
    useDirectoryReaderV3RelationsListInfinite(
      {
        object_id: objectId,
        object_type: objectType,
        'page.size': 100,
        with_objects: true,
      },
      {
        query: {
          getNextPageParam: getNextPage,
        },
      },
    )

  const { data: incomingRelationsData, queryKey: incomingRelationsQueryKey } =
    useDirectoryReaderV3RelationsListInfinite(
      {
        'page.size': 100,
        subject_id: objectId,
        subject_type: objectType,
        with_objects: true,
      },
      {
        query: {
          getNextPageParam: getNextPage,
        },
      },
    )

  const { mutate: addRelation } = useDirectoryWriterV3RelationSet({
    mutation: {
      onError: (e) => {
        showError(e)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: incomingRelationsQueryKey })
        queryClient.invalidateQueries({ queryKey: outgoingRelationsQueryKey })
        queryClient.invalidateQueries({ queryKey: relationsQueryKey })
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: incomingRelationsQueryKey })
        queryClient.invalidateQueries({ queryKey: outgoingRelationsQueryKey })
        queryClient.invalidateQueries({ queryKey: relationsQueryKey })
      },
    },
  })

  const { mutate: removeRelation } = useDirectoryWriterV3RelationDelete({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: incomingRelationsQueryKey })
        queryClient.invalidateQueries({ queryKey: outgoingRelationsQueryKey })
        queryClient.invalidateQueries({ queryKey: relationsQueryKey })
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: incomingRelationsQueryKey })
        queryClient.invalidateQueries({ queryKey: outgoingRelationsQueryKey })
        queryClient.invalidateQueries({ queryKey: relationsQueryKey })
      },
    },
  })

  const getRelationSetter = (
    selectedObjectType: string,
    selectedObjectId: string,
    selectedSubjectRelation?: string,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !!relationType && !!safeObjectId
      ? isOutgoingRelations
        ? addRelation({
            data: {
              relation: {
                object_id: safeObjectId,
                object_type: safeObjectType,
                relation: relationType,
                subject_id: selectedObjectId,
                subject_relation: selectedSubjectRelation,
                subject_type: selectedObjectType,
              },
            },
          })
        : addRelation({
            data: {
              relation: {
                object_id: selectedObjectId,
                object_type: selectedObjectType,
                relation: relationType,
                subject_id: safeObjectId,
                subject_relation: selectedSubjectRelation,
                subject_type: safeObjectType,
              },
            },
          })
      : undefined
  }

  const { data: relationTypes } = useDirectoryV3RelationTypesList()

  const columns: ColumnDef<RelationTypeColumn>[] = [
    {
      cell: ({ row }) => {
        return (
          <Link
            to={`/ui/directory/objects/${safeObjectType}/${encodeURIComponent(
              safeObjectId,
            )}/${relationSide}-relations/${row.original.relationObjectTypeName || ''}/${
              row.original.name || ''
            }`}
            onClick={() => {
              table.setRowSelection({ [row.id]: !row.getIsSelected() })
            }}
          >
            {row.original.name ?? ''}
          </Link>
        )
      },
      header: 'Name',
    },
    {
      cell: ({ row }) => {
        return <>{row.original.relationObjectTypeName}</>
      },
      header: 'Type',
    },
  ]

  const objects: V3GetRelationsResponseObjects = useMemo(() => {
    return {}
  }, [])

  const objectTypes = useObjectRelationTypes(safeObjectType)

  const incomingRelations: V3Relation[] = useMemo(() => {
    return (
      incomingRelationsData?.pages
        .map((relation) => {
          Object.assign(objects, relation.objects)
          return relation.results || []
        })
        .flat() || []
    )
  }, [incomingRelationsData?.pages, objects])

  useEffect(() => {
    let types: RelationTypeColumn[] =
      relationTypes?.results
        ?.filter((r) => !isOutgoingRelations || r.objectType === objectType)
        .map((r) => ({
          name: r.name,
          relationObjectTypeName: r.objectType,
        })) || []
    if (!isOutgoingRelations) {
      types = Object.keys(objectTypes).flatMap((objectType) => {
        return Array.from(objectTypes[objectType].values())
          .map((type) => {
            return {
              name: type,
              relationObjectTypeName: objectType,
            }
          })
          .flat()
      })
    }
    setRelationTypesTableData(types)
  }, [
    incomingRelations,
    isOutgoingRelations,
    objectType,
    objectTypes,
    relationTypes?.results,
  ])

  const relationCardDisplayName = useCallback(
    (o: V3Relation, target: 'object' | 'subject'): string => {
      return (
        objects[`${o?.[`${target}_type`]}:${o?.[`${target}_id`]}`]
          ?.display_name ||
        o?.[`${target}_id`] ||
        ''
      )
    },
    [objects],
  )

  const subjectRelationName = (o: V3Relation): string => {
    if (o?.subject_relation) {
      return `${o?.subject_type}#${o?.subject_relation}`
    }
    return ''
  }

  const outgoingRelations: V3Relation[] = useMemo(() => {
    return (
      outgoingRelationsData?.pages
        .map((relation) => {
          Object.assign(objects, relation.objects)
          return relation.results || []
        })
        .flat() || []
    )
  }, [outgoingRelationsData?.pages, objects])

  const relationsToSubjectsTableData: RelationCardProp[] = useMemo(
    () =>
      (!!relationType &&
        isOutgoingRelations &&
        outgoingRelations
          .filter((o) => String(o?.relation) === relationType)
          .map((o) => ({
            relation: o?.relation || '',
            relationCardDisplayName: relationCardDisplayName(o, 'subject'),
            relationCardKey: o?.subject_id || '',
            relationCardType: o?.subject_type || '',
            removeRelation: () =>
              removeRelation({
                params: {
                  object_id: safeObjectId,
                  object_type: safeObjectType,
                  relation: o?.relation || '',
                  subject_id: o?.subject_id || '',
                  subject_relation: o.subject_relation,
                  subject_type: o?.subject_type || '',
                },
              }),
            subjectRelationName: subjectRelationName(o),
          }))) ||
      [],
    [
      isOutgoingRelations,
      outgoingRelations,
      relationType,
      removeRelation,
      safeObjectId,
      safeObjectType,
      relationCardDisplayName,
    ],
  )

  const outgoingDestinationObjectType: string = useMemo(() => {
    const subjectType = relationsToSubjectsTableData?.[0]?.relationCardType
    return isOutgoingRelations && !!subjectType
      ? subjectType[0].toUpperCase() + subjectType.slice(1)
      : 'Object'
  }, [isOutgoingRelations, relationsToSubjectsTableData])

  const relationsToObjectsTableData: RelationCardProp[] = useMemo(
    () =>
      (!!relationType &&
        !isOutgoingRelations &&
        incomingRelations
          .filter(
            (o) =>
              String(o?.object_type) === relationSubject &&
              String(o?.relation) === relationType,
          )
          .map((o) => ({
            relation: o?.relation || '',
            relationCardDisplayName: relationCardDisplayName(o, 'object'),
            relationCardKey: o?.object_id || '',
            relationCardType: o?.object_type || '',
            removeRelation: () =>
              removeRelation({
                params: {
                  object_id: o?.object_id || '',
                  object_type: o?.object_type || '',
                  relation: o?.relation || '',
                  subject_id: safeObjectId,
                  subject_relation: o.subject_relation,
                  subject_type: safeObjectType,
                },
              }),
            subjectRelationName: subjectRelationName(o),
          }))) ||
      [],
    [
      isOutgoingRelations,
      incomingRelations,
      relationSubject,
      relationType,
      removeRelation,
      safeObjectId,
      safeObjectType,
      relationCardDisplayName,
    ],
  )

  const relationInstancesData: RelationCardProp[] = useMemo(
    () =>
      isOutgoingRelations
        ? relationsToSubjectsTableData
        : relationsToObjectsTableData,
    [
      isOutgoingRelations,
      relationsToObjectsTableData,
      relationsToSubjectsTableData,
    ],
  )

  const displayState = useDirectoryDisplayState()

  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    columns: columns,
    data: relationTypesTableData,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  return (
    <>
      <AddRelationModal
        object={object}
        relation={{
          objectType: relationSubject?.split('#')[0] ?? '',
          type: relationType ?? '',
        }}
        relationSideProperty={isOutgoingRelations ? 'subject' : 'object'}
        show={showAddRelationModal}
        onHide={() => setShowAddRelationModal(false)}
        onSave={getRelationSetter}
      />
      <HighlightedContainer>
        {isOutgoingRelations
          ? `The Outgoing relations tab shows relations from this ${objectType} to other subjects (${objectType} → ${outgoingDestinationObjectType}).`
          : `The Incoming relations tab shows relations from other objects into this ${objectType} (Object → ${objectType}).`}
      </HighlightedContainer>
      <ContentContainer>
        <RelationTypesTableContainer>
          {relationTypesTableData.length ? (
            <DataTable table={table}></DataTable>
          ) : (
            `This ${objectType} has no ${relationSide} relations.`
          )}
        </RelationTypesTableContainer>

        <RelationsContainer>
          {!!relationType && (
            <EvaluateDisplayState displayState={displayState.canAddRelation}>
              <AddButton
                variant="secondary"
                onClick={() => setShowAddRelationModal(true)}
              >
                <img alt="plus" src={plus}></img>&nbsp;&nbsp;Add a relation
              </AddButton>
            </EvaluateDisplayState>
          )}
          <RelationCardsContainer>
            {relationInstancesData.length
              ? relationInstancesData.map((r, i) => {
                  return (
                    <UndecoratedLink
                      key={i}
                      to={`/ui/directory/objects/${r.relationCardType}/${encodeURIComponent(
                        r.relationCardKey,
                      )}`}
                    >
                      <RelationCard>
                        <div>
                          <BoldSpan>
                            {String(
                              r.relationCardDisplayName || r.relationCardKey,
                            )}
                          </BoldSpan>
                          {r.relationCardDisplayName && (
                            <CardDetails>
                              <EllipsisDiv>
                                <BoldSpan>Id: </BoldSpan>
                                <span>{r.relationCardKey}</span>
                              </EllipsisDiv>
                              {r.subjectRelationName && (
                                <EllipsisDiv>
                                  <BoldSpan>Subject relation: </BoldSpan>
                                  <span> {String(r.subjectRelationName)}</span>
                                </EllipsisDiv>
                              )}
                            </CardDetails>
                          )}
                        </div>
                        <EvaluateDisplayState
                          displayState={displayState.canRemoveRelation}
                        >
                          <ImageButton
                            className="left-auto"
                            onClick={(e) => {
                              e.preventDefault()
                              r.removeRelation()
                            }}
                          >
                            {' '}
                            <img alt="delete" src={BinImg} />
                          </ImageButton>
                        </EvaluateDisplayState>
                      </RelationCard>
                    </UndecoratedLink>
                  )
                })
              : !!relationType && (
                  <NoRelationText>
                    This {objectType} has no {relationSide} relations of type{' '}
                    {relationType}.
                  </NoRelationText>
                )}
          </RelationCardsContainer>
        </RelationsContainer>
      </ContentContainer>
    </>
  )
}

export default ObjectRelations
