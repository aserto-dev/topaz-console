import React, { useEffect, useMemo } from 'react'

import { FieldContainer, ResourceTextArea } from '../styles'
import {
  useCommonPolicyEvaluatorContext,
  usePolicyEvaluatorErrorContext,
  useRebacPolicyEvaluatorContext,
} from '../../../../../../../services/PolicyEvaluatorContextProvider/hooks'
import {
  getNextPage,
  useDirectoryV3PermissionsList,
  useDirectoryV3RelationTypesList,
} from '../../../../../../../api/directory/customQuery'
import { useDirectoryReaderV3ObjectsListInfinite } from '../../../../../../../api/v3/directory'
import Label from '../../../../../../../components/common/Label'
import { SelectOption } from '../../../../../../../components/common/Select'

export const ResourceContext = () => {
  const {
    objectType,
    setObjectType,
    setObjectInstance,
    setRelationType,
    setPermission,
  } = useRebacPolicyEvaluatorContext()
  const { setResourceContext, resourceContext } =
    useCommonPolicyEvaluatorContext()
  const { resourceContextError } = usePolicyEvaluatorErrorContext()
  const { data: permissionsData } = useDirectoryV3PermissionsList({
    objectType: objectType,
  })

  const permissions = useMemo(() => {
    if (objectType === undefined || objectType === '') {
      return []
    }
    return (
      permissionsData?.results?.map((p) => ({
        label: p.displayName || p.name,
        value: p.name,
      })) || []
    )
  }, [permissionsData?.results, objectType])

  const { data: relationTypesData } = useDirectoryV3RelationTypesList()
  const relations = useMemo(() => {
    return (
      relationTypesData?.results
        ?.filter((relation) => {
          return relation.objectType === objectType
        })
        .map((n) => ({ label: n.displayName || n.name, value: n.name })) || []
    )
  }, [objectType, relationTypesData?.results])

  const { data: objectsData } = useDirectoryReaderV3ObjectsListInfinite(
    {
      object_type: objectType,
      'page.size': 100,
    },
    {
      query: {
        getNextPageParam: getNextPage,
      },
    },
  )
  const objectInstances = useMemo(
    () =>
      objectsData?.pages
        .map((page) => page.results || [])
        .flat()
        .map((object) => {
          return { label: object.display_name || object.id, value: object.id }
        }) ?? [],
    [objectsData?.pages],
  )

  useEffect(() => {
    setObjectInstance(objectInstances[0] || null)
  }, [objectInstances, setObjectInstance])

  return (
    <FieldContainer>
      <Label>Resource Context</Label>
      <ResourceTextArea
        $hasError={!!resourceContextError}
        placeholder='{ "id": "123" }'
        rows={10}
        value={resourceContext}
        onChange={(e: { target: { value: string } }) => {
          const value = e.target.value
          setResourceContext(value)
          handleChange(
            value,
            setObjectType,
            setObjectInstance,
            setRelationType,
            relations,
            setPermission,
            permissions,
          )
        }}
        onPaste={(e: {
          clipboardData: { getData: (arg0: string) => string }
        }) => {
          const value = e.clipboardData.getData('Text')
          handleChange(
            value,
            setObjectType,
            setObjectInstance,
            setRelationType,
            relations,
            setPermission,
            permissions,
          )
        }}
      />
    </FieldContainer>
  )
}
const handleChange = (
  value: string,
  setObjectType: React.Dispatch<React.SetStateAction<string>>,
  setObjectInstance: React.Dispatch<React.SetStateAction<SelectOption | null>>,
  setRelationType: React.Dispatch<React.SetStateAction<SelectOption | null>>,
  relations: { label: string; value: string }[],
  setPermission: React.Dispatch<React.SetStateAction<SelectOption | null>>,
  permissions: { label: string; value: string }[],
) => {
  let ctx = { object_type: '', object_key: '', relation: '', permission: '' }
  try {
    ctx = JSON.parse(value !== '' ? value : '{}')
  } catch {
    /* empty */
  }
  const newObjectType = ctx['object_type'] || ''
  const newObjectKey = ctx['object_key']
  const newRelation = ctx['relation']
  const newPermission = ctx['permission']

  setObjectType(newObjectType)

  setObjectInstance({ label: newObjectKey, value: newObjectKey })

  setRelationType(relations.find((rel) => rel.value === newRelation) || null)
  setPermission(permissions.find((per) => per.value === newPermission) || null)
}
