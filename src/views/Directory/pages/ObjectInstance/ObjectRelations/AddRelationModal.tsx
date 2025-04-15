import React, { useEffect, useMemo, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import styled from 'styled-components'

import Button from '../../../../../components/common/Button'
import { CardModal } from '../../../../../components/common/CardModal'
import Select from '../../../../../components/common/Select'
import { V3Object } from '../../../../../types/directory'
import Label from '../../../../../components/common/Label'
import { colourStyles } from '../../../../../components/common/Select/colourStyles'
import { useSubjectRelationTypes } from '../../../hooks/useSubjectRelationTypes'
import {
  getNextPage,
  useDirectoryV3ObjectTypesList,
  useDirectoryV3RelationTypesList,
} from '../../../../../api/directory/customQuery'
import { useDirectoryReaderV3ObjectsListInfinite } from '../../../../../api/v3/directory'

const ContentContainer = styled.div`
  padding: 20px;
  width: 100%;
`

const FormContainer = styled.div`
  margin-top: 18px;
`

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px auto;
`

const ButtonsContainer = styled.div`
  width: 100%;
  flex: 1 1 0%;
  justify-content: flex-end;
  align-items: flex-end;
  float: right;
  display: flex;
  margin-top: 20px;
  button:first-of-type {
    margin-right: 10px;
  }
`
type AddRelationModalProps = {
  show: boolean
  onHide: () => void
  relation: { type: string; objectType: string }
  relationSideProperty: 'subject' | 'object'
  object: V3Object | undefined
  onSave?: (
    objectType: string,
    objectKey: string,
    subjectRelation?: string,
  ) => void
}

const AddRelationModal: React.FC<AddRelationModalProps> = ({
  relationSideProperty,
  relation,
  onSave,
  onHide,
  show,
  object,
}) => {
  const [selectedObjectType, setSelectedObjectType] = useState<string | null>()
  const [selectedObjectKey, setSelectedObjectKey] = useState<string | null>()
  const [selectedSubjectRelation, setSelectedSubjectRelation] = useState<
    string | null
  >()
  const [filter, setFilter] = useState<string>('')
  const safeObjectType = object?.type || ''

  const subjectTypes = useSubjectRelationTypes(
    relation.objectType,
    relation.type,
  )

  const { data: objectTypesData } = useDirectoryV3ObjectTypesList()
  const objectTypes = useMemo(
    () =>
      objectTypesData?.results
        ?.filter((objectType) =>
          Object.keys(subjectTypes).includes(objectType.name),
        )
        .map((p) => ({ label: p.displayName || p.name, value: p.name })),
    [objectTypesData, subjectTypes],
  )

  const {
    data: objectsData,
    isLoading: isLoadingObjectRelations,
    hasNextPage: hasMoreObjectRelations,
    fetchNextPage: fetchNextObjectRelations,
  } = useDirectoryReaderV3ObjectsListInfinite(
    {
      object_type: selectedObjectType ?? '',
      'page.size': 100,
    },
    {
      query: {
        enabled: !!selectedObjectType,
        getNextPageParam: getNextPage,
      },
    },
  )

  const objects = useMemo(
    () =>
      objectsData?.pages
        .map((page) => page.results || [])
        .flat()
        .map((object) => {
          return { label: object.display_name || object.id, value: object.id }
        }),
    [objectsData?.pages],
  )

  const { data: subjectRelationTypeData } = useDirectoryV3RelationTypesList({
    objectType:
      relationSideProperty === 'object'
        ? object?.type
        : selectedObjectType || '',
  })

  const subjectRelationTypes = useMemo(
    () =>
      subjectRelationTypeData?.results
        ?.filter(
          (objectType) =>
            Object.keys(subjectTypes).includes(objectType.objectType) &&
            Array.from(subjectTypes[objectType.objectType].values()).includes(
              objectType.name,
            ),
        )
        ?.map((sr) => ({
          label: sr.displayName,
          value: sr.name,
        })),
    [subjectRelationTypeData?.results, subjectTypes],
  )

  useEffect(() => {
    if (relationSideProperty === 'object' && show) {
      setSelectedObjectType(relation.objectType)
    }
  }, [relation.objectType, relationSideProperty, show])

  const clearRelationModal = () => {
    onHide()
    setSelectedObjectKey(null)
    setSelectedObjectType(null)
    setSelectedSubjectRelation(null)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      clearRelationModal()
    }
  }

  const subjectRelations = useMemo(() => {
    return relationSideProperty === 'object'
      ? subjectTypes[String(object?.type)] || new Set<string>()
      : subjectTypes[String(selectedObjectType)] || new Set<string>()
  }, [selectedObjectType, subjectTypes, relationSideProperty, object?.type])

  useEffect(() => {
    if (subjectRelations.size === 1) {
      setSelectedSubjectRelation([...subjectRelations][0])
    }
  }, [subjectRelations])

  return (
    <>
      <CardModal
        cardHeight="100%"
        show={show}
        title={`Add a ${relation.type} relation`}
        onHide={clearRelationModal}
      >
        <ContentContainer className="add-a-relation-modal-content">
          <div>
            {relationSideProperty === 'subject'
              ? `Select a subject type, then select the subject for a new outgoing ${relation.type} relation, and then click the Add relation button.`
              : `Select the ${relation.objectType} that should have a ${relation.type} relation to this Subject, and click the Add relation button.`}
          </div>
          <FormContainer>
            {relationSideProperty === 'subject' && (
              <FieldContainer>
                <Select
                  autoFocus
                  className="subject-type-select"
                  label="Subject Type"
                  name="subject-type-select"
                  options={objectTypes}
                  onChange={(o) => {
                    setSelectedObjectType(o ? String(o.value) : undefined)
                    setSelectedObjectKey(null)
                    setSelectedSubjectRelation(undefined)
                  }}
                  onKeyDown={onKeyDown}
                />
              </FieldContainer>
            )}
            <Label>
              {relationSideProperty === 'subject'
                ? 'Subject'
                : `${relation.objectType.charAt(0).toUpperCase() + relation.objectType.slice(1)}`}
            </Label>
            <CreatableSelect
              autoFocus={relationSideProperty === 'object'}
              className="relation-select"
              inputValue={filter}
              isClearable
              isLoading={isLoadingObjectRelations}
              name="relation-select"
              options={objects}
              styles={colourStyles}
              value={
                objects?.find((o) => o.value === selectedObjectKey) || null
              }
              onChange={(o) =>
                setSelectedObjectKey(o ? String(o.value) : undefined)
              }
              onInputChange={setFilter}
              onKeyDown={onKeyDown}
              onMenuScrollToBottom={() => {
                if (hasMoreObjectRelations) {
                  fetchNextObjectRelations()
                }
              }}
            />
            {subjectRelations.size > 1 && (
              <FieldContainer>
                <Select
                  className="subject-relation-select"
                  label={
                    relationSideProperty === 'object'
                      ? `${
                          safeObjectType.charAt(0).toUpperCase() +
                          safeObjectType.slice(1)
                        } Subject Relation`
                      : 'Subject Relation'
                  }
                  name="subject-relation-select"
                  options={subjectRelationTypes}
                  onChange={(o) =>
                    setSelectedSubjectRelation(o ? String(o.value) : undefined)
                  }
                  onKeyDown={onKeyDown}
                />
              </FieldContainer>
            )}
          </FormContainer>
          <ButtonsContainer>
            <Button
              data-testid="cancel-btn"
              variant="secondary"
              onClick={clearRelationModal}
            >
              Cancel
            </Button>
            <Button
              data-testid="add-relation-modal-btn"
              disabled={!selectedObjectKey || !selectedObjectType || !onSave}
              id="add-relation"
              type="submit"
              onClick={() => {
                if (selectedObjectKey) {
                  onSave?.(
                    selectedObjectType || '',
                    selectedObjectKey,
                    selectedSubjectRelation || undefined,
                  )
                }
                clearRelationModal()
              }}
            >
              Add relation
            </Button>
          </ButtonsContainer>
        </ContentContainer>
      </CardModal>
    </>
  )
}

export default AddRelationModal
