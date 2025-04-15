import React, { useEffect, useMemo } from 'react'

import { useDirectoryV3PermissionsList } from '../../../../../../api/directory/customQuery'
import {
  useDirectoryV3ObjectTypesList,
  useDirectoryV3RelationTypesList,
} from '../../../../../../api/directory/customQuery'
import { Row } from '../../../../../../components/common/Row'
import Select from '../../../../../../components/common/Select'
import { colourStyles } from '../../../../../../components/common/Select/colourStyles'
import {
  useCommonPolicyEvaluatorContext,
  useContentPolicyEvaluatorContext,
  useIsPolicyEvaluatorContext,
  useRebacPolicyEvaluatorContext,
} from '../../../../../../services/PolicyEvaluatorContextProvider/hooks'
import { EvaluatorStyledInput, FieldContainer, InputTopMargin } from '../styles'

export const RebacEvaluator: React.FC = () => {
  const {
    objectInstance,
    objectType,
    relationType,
    setObjectInstance,
    setObjectType,
    setRelationType,
    setSubjectType,
  } = useRebacPolicyEvaluatorContext()
  const { identity, request, setIdentity, setType } =
    useContentPolicyEvaluatorContext()
  const { resourceContext, setResourceContext } =
    useCommonPolicyEvaluatorContext()
  const { setPathSelect } = useIsPolicyEvaluatorContext()
  const { data: objectTypesData } = useDirectoryV3ObjectTypesList()

  useEffect(() => {
    setSubjectType('user')
  })

  const { data: relationTypesData } = useDirectoryV3RelationTypesList()
  const relations = useMemo(() => {
    return relationTypesData?.results
      ?.filter((relation) => {
        return relation.objectType === objectType
      })
      .map((n) => ({ label: n.displayName || n.name, value: n.name }))
  }, [objectType, relationTypesData])

  const objectTypes = useMemo(() => {
    return (
      objectTypesData?.results?.map((o) => ({
        label: o.displayName || o.name,
        value: o.name,
      })) || []
    )
  }, [objectTypesData?.results])

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

  const relationsPermissions = [
    {
      label: 'Relations',
      options: relations || [],
    },

    {
      label: 'Permissions',
      options: permissions || [],
    },
  ]

  return (
    <>
      <Row $centered>
        <FieldContainer>
          <EvaluatorStyledInput
            label="Subject"
            placeholder="Identity"
            value={identity || ''}
            onChange={(e) => {
              setIdentity(e.target.value)
              setType('IDENTITY_TYPE_SUB')
            }}
          />
        </FieldContainer>
      </Row>

      <Row $centered>
        <FieldContainer>
          <Select
            label="Object Type"
            options={objectTypes}
            value={objectTypes.find(({ value }) => value === objectType)}
            onChange={(option) => {
              if (option?.value) {
                setResourceContext(
                  JSON.stringify(
                    {
                      ...JSON.parse(
                        resourceContext !== '' ? resourceContext : '{}',
                      ),
                      object_id: '',
                      object_type: String(option.value),
                    },
                    null,
                    2,
                  ),
                )
                setObjectType(String(option.value))
                setObjectInstance(null)
                setRelationType(null)
              }
            }}
          />
        </FieldContainer>
        <FieldContainer $marginLeft={20}>
          <InputTopMargin>
            <EvaluatorStyledInput
              label="Object ID"
              placeholder="Object ID"
              value={objectInstance?.value || ''}
              onChange={(e: { target: { value: string } }) => {
                setObjectInstance({
                  label: e.target.value,
                  value: e.target.value,
                })
                setResourceContext(
                  JSON.stringify(
                    {
                      ...JSON.parse(
                        resourceContext !== '' ? resourceContext : '{}',
                      ),
                      object_id: String(e.target.value),
                    },
                    null,
                    2,
                  ),
                )
              }}
            />
          </InputTopMargin>
        </FieldContainer>
      </Row>
      {request === 'CHECK' && (
        <FieldContainer>
          <Select
            label="Relation"
            modifyCustomStyle={() => colourStyles}
            options={relationsPermissions}
            value={relationType}
            onChange={(option) => {
              setRelationType(option)
              setPathSelect('rebac.check')
              const context = JSON.parse(
                resourceContext !== '' ? resourceContext : '{}',
              )
              delete context['permission']

              setResourceContext(
                JSON.stringify(
                  {
                    ...context,
                    relation: String(option?.value),
                  },
                  null,
                  2,
                ),
              )
            }}
          />
        </FieldContainer>
      )}
    </>
  )
}
