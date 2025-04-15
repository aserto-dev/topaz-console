import React, { useMemo } from 'react'

import {
  useDirectoryV3PermissionsList,
  useDirectoryV3RelationTypesList,
} from '../../../../../../../api/directory/customQuery'
import Label from '../../../../../../../components/common/Label'
import { SelectOption } from '../../../../../../../components/common/Select'
import {
  useCommonPolicyEvaluatorContext,
  usePolicyEvaluatorErrorContext,
  useRebacPolicyEvaluatorContext,
} from '../../../../../../../services/PolicyEvaluatorContextProvider/hooks'
import { FieldContainer, ResourceTextArea } from '../styles'

export const ResourceContext = () => {
  const {
    objectType,
    setObjectInstance,
    setObjectType,
    setPermission,
    setRelationType,
  } = useRebacPolicyEvaluatorContext()
  const { resourceContext, setResourceContext } =
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
  setObjectInstance: React.Dispatch<React.SetStateAction<null | SelectOption>>,
  setRelationType: React.Dispatch<React.SetStateAction<null | SelectOption>>,
  relations: { label: string; value: string }[],
  setPermission: React.Dispatch<React.SetStateAction<null | SelectOption>>,
  permissions: { label: string; value: string }[],
) => {
  let ctx = { object_key: '', object_type: '', permission: '', relation: '' }
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
