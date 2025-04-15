import React, { useMemo, useState } from 'react'

import {
  getNextPage,
  useDirectoryV3CheckQuery,
  useDirectoryV3ObjectTypesList,
} from '../../../../api/directory/customQuery'
import {
  useDirectoryV3PermissionsList,
  useDirectoryV3RelationTypesList,
} from '../../../../api/directory/customQuery'
import { useDirectoryReaderV3Graph } from '../../../../api/v3/directory'
import {
  useDirectoryReaderV3ObjectGet,
  useDirectoryReaderV3ObjectsListInfinite,
  useDirectoryReaderV3RelationsListInfinite,
} from '../../../../api/v3/directory'
import Highlight from '../../../../components/common/Highlight'
import Label from '../../../../components/common/Label'
import { PlayButton } from '../../../../components/common/PlayButton'
import { Row } from '../../../../components/common/Row'
import Select from '../../../../components/common/Select'
import { colourStyles } from '../../../../components/common/Select/colourStyles'
import { useDirectoryEvaluatorContext } from '../../../../services/DirectoryContextProvider/hooks'
import { useCopyCurlRest } from './copyCurlRest'
import {
  ButtonsContainer,
  Container,
  CopyButton,
  EvaluatorContainer,
  EvaluatorLabel,
  Header,
  HeaderSelectContainer,
  HeaderTitle,
  LeftContainer,
  ObjectDiv,
  PlayButtonHeader,
  ResultsContainer,
  RightContainer,
  SmallScreenPlayDiv,
  SubContainer,
  TextBox,
} from './styles'

export type RequestPayload = FindObjectsPayload &
  FindUsersPayload &
  ObjectPayload &
  ObjectRelationsPayload &
  ObjectsPayload &
  PermissionPayload &
  RelationsPayload
type FindObjectsPayload = {
  object_type: string
  relation: string
  subject_id: string
  subject_type: string
}
type FindUsersPayload = {
  object_id: string
  object_type: string
  relation: string
  subject_type: string
}
type ObjectPayload = {
  object_id: string
  object_type: string
}
type ObjectRelationsPayload = {
  object_id: string
  object_type: string
}

type ObjectsPayload = {
  object_type: string
}

type PermissionPayload = {
  object_id: string
  object_type: string
  permission: string
  subject_id: string
  subject_type: string
}

type RelationsPayload = {
  object_id: string
  object_type: string
  relation: string
  subject_id: string
  subject_type: string
}

const DirectoryEvaluator: React.FC = () => {
  const {
    objectInstance,
    objectType,
    relationType,
    request,
    setObjectInstance,
    setObjectType,
    setRelationType,
    setRequest,
    setSubjectInstance,
    setSubjectType,
    subjectInstance,
    subjectType,
  } = useDirectoryEvaluatorContext()

  const REQUEST_PATHS = {
    CHECK: 'api/v3/directory/check',
    GRAPH: 'api/v3/directory/graph',
    OBJECT: 'api/v3/directory/object',
    OBJECTS: 'api/v3/directory/objects',
    RELATIONS: 'api/v3/directory/relations',
  } as const

  const [query, setQuery] = useState<string>()
  const [results, setResults] = useState<string>()

  const getRequestPath = () => {
    switch (request) {
      case 'check':
        return REQUEST_PATHS.CHECK
      case 'find_objects':
        return REQUEST_PATHS.GRAPH
      case 'find_users':
        return REQUEST_PATHS.GRAPH
      case 'object':
        return REQUEST_PATHS.OBJECT
      case 'objects':
        return REQUEST_PATHS.OBJECTS
      case 'relations':
        return REQUEST_PATHS.RELATIONS
    }
    return ''
  }
  const getPayload = (request: string) => {
    switch (request) {
      case 'check':
        return {
          object_id: String(objectInstance?.value || ''),
          object_type: objectType,
          relation: String(relationType?.value || ''),
          subject_id: String(subjectInstance?.value || ''),
          subject_type: subjectType,
        }
      case 'find_objects':
        return {
          object_type: objectType,
          relation: String(relationType?.value || ''),
          subject_id: String(subjectInstance?.value || ''),
          subject_type: 'user',
        }
      case 'find_users':
        return {
          object_id: String(objectInstance?.value || ''),
          object_type: objectType,
          relation: String(relationType?.value || ''),
          subject_type: 'user',
        }
      case 'object':
        return {
          object_id: String(objectInstance?.value || ''),
          object_type: objectType,
        }
      case 'objects':
        return { object_type: objectType }

      case 'relations':
        return {
          object_id: String(objectInstance?.value || ''),
          object_type: objectType,
        }
    }
  }
  const { copyCurlRest } = useCopyCurlRest(
    request,
    getPayload(request)! as RequestPayload,
    getRequestPath(),
  )

  const requestOptions = [
    { label: 'Check', value: 'check' },
    { label: 'Get object', value: 'object' },
    { label: 'Get objects by type', value: 'objects' },
    { label: 'Get relations of object', value: 'relations' },
    { label: 'Find objects that a user can access', value: 'find_objects' },
    { label: 'Find users that can access an object', value: 'find_users' },
  ]

  const { refetch: refetchCheck } = useDirectoryV3CheckQuery(
    {
      object_id: String(objectInstance?.value || ''),
      object_type: objectType,
      relation: String(relationType?.value || ''),
      subject_id: String(subjectInstance?.value || ''),
      subject_type: subjectType,
    },
    {
      enabled: false,
    },
  )

  const { refetch: refetchObjectData } = useDirectoryReaderV3ObjectGet(
    objectType || '',
    String(objectInstance?.value || ''),
    {},
    {
      query: {
        enabled: false,
      },
    },
  )

  const { refetch: refetchObjectsByTypeData } =
    useDirectoryReaderV3ObjectsListInfinite(
      {
        object_type: objectType,
      },
      {
        query: {
          enabled: false,
          getNextPageParam: getNextPage,
        },
      },
    )

  const { refetch: refetchIncomingRelationsData } =
    useDirectoryReaderV3RelationsListInfinite(
      {
        'page.size': 100,
        subject_id: String(objectInstance?.value || ''),
        subject_type: objectType || '',
      },
      {
        query: {
          enabled: false,
          getNextPageParam: getNextPage,
        },
      },
    )

  const { refetch: refetchOutgoingRelationsData } =
    useDirectoryReaderV3RelationsListInfinite(
      {
        object_id: String(objectInstance?.value || ''),
        object_type: objectType || '',
        'page.size': 100,
      },
      {
        query: {
          enabled: false,
          getNextPageParam: getNextPage,
        },
      },
    )

  const { refetch: refetchGetGraph } = useDirectoryReaderV3Graph(
    objectType,
    String(relationType?.value || ''),
    subjectType,
    {
      object_id: String(objectInstance?.value || ''),
      subject_id: String(subjectInstance?.value || ''),
    },
    {
      query: { enabled: false },
    },
  )

  const { data: objectTypesData } = useDirectoryV3ObjectTypesList()

  const {
    data: subjectsData,
    fetchNextPage: fetchNextSubjectsData,
    hasNextPage: hasMoreSubjects,
  } = useDirectoryReaderV3ObjectsListInfinite(
    {
      object_type: subjectType,
      'page.size': 100,
    },
    {
      query: {
        enabled: !!subjectType,
        getNextPageParam: getNextPage,
      },
    },
  )
  const subjects = useMemo(
    () =>
      subjectsData?.pages
        .map((page) => page.results || [])
        .flat()
        .map((object) => {
          return { label: object.display_name || object.id, value: object.id }
        }) ?? [],
    [subjectsData?.pages],
  )

  const { data: permissionsData } = useDirectoryV3PermissionsList({
    objectType: objectType,
  })

  const permissions = useMemo(() => {
    return (
      permissionsData?.results?.map((p) => ({
        label: p.displayName || p.name,
        value: p.name,
      })) || []
    )
  }, [permissionsData?.results])

  const { data: relationTypesData } = useDirectoryV3RelationTypesList({
    objectType: objectType,
  })

  const relations = useMemo(() => {
    return relationTypesData?.results?.map((n) => ({
      label: n.displayName || n.name,
      value: n.name,
    }))
  }, [relationTypesData])

  const relationsPermissions = useMemo(() => {
    return [
      {
        label: 'Relations',
        options: relations || [],
      },

      {
        label: 'Permissions',
        options: permissions || [],
      },
    ]
  }, [relations, permissions])

  const objectTypes = useMemo(() => {
    if (!objectTypesData || !objectTypesData.results) {
      return []
    }
    return objectTypesData?.results?.map((o) => ({
      label: o.displayName || o.name,
      value: o.name,
    }))
  }, [objectTypesData])

  const {
    data: objectsData,
    fetchNextPage: fetchMoreObjects,
    hasNextPage: hasMoreObjects,
  } = useDirectoryReaderV3ObjectsListInfinite(
    {
      object_type: objectType,
      'page.size': 100,
    },
    {
      query: {
        enabled: !!objectType,
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

  const disableButton = useMemo(() => {
    switch (request) {
      case 'check':
        return !relationType || !subjectInstance || !objectInstance
      case 'find_objects':
        return !subjectInstance || !objectType || !relationType
      case 'find_users':
        return !objectInstance || !objectType || !relationType
      case 'object':
        return !objectInstance || !objectType
      case 'objects':
        return !objectType
      case 'relations':
        return !objectInstance || !objectType
      default:
        return !request
    }
  }, [objectInstance, objectType, relationType, request, subjectInstance])

  const emptyReplacer:
    | ((this: unknown, key: string, value: unknown) => unknown)
    | undefined = (_, value) => {
    if (value === '') {
      return undefined
    }

    return value
  }

  const evaluate = async () => {
    let currentQuery, data
    switch (request) {
      case 'check':
        data = (await refetchCheck()).data
        break
      case 'find_objects':
        data = (await refetchGetGraph()).data?.results
        currentQuery = 'find_objects' // placeholder for copyAsCurl state
        break
      case 'find_users':
        data = (await refetchGetGraph()).data?.results
        currentQuery = 'find_users' // placeholder for copyAsCurl state
        break
      case 'object':
        data = (await refetchObjectData()).data?.result
        break

      case 'objects':
        data = (await refetchObjectsByTypeData()).data?.pages.flatMap(
          (page) => page.results || [],
        )
        break
      case 'relations': {
        const incomingData = await refetchIncomingRelationsData()
        const outgoingData = await refetchOutgoingRelationsData()
        data = {
          incomingRelations: (
            incomingData.data?.pages.map((page) => {
              return page.results || []
            }) || []
          ).flat(),
          outgoingRelations: (
            outgoingData.data?.pages.map((page) => {
              return page.results || []
            }) || []
          ).flat(),
        }

        break
      }
      default:
        break
    }

    setResults(JSON.stringify(data, emptyReplacer, 2))
    setQuery(currentQuery)
  }

  return (
    <Container>
      <Header>
        <Row $centered style={{ height: '100%' }}>
          <Row $centered $flex style={{ marginRight: 20 }}>
            <HeaderTitle>REQUEST:</HeaderTitle>
            <HeaderSelectContainer>
              <Select
                isSearchable={false}
                options={requestOptions}
                value={requestOptions.find(({ value }) => value === request)}
                onChange={(option) => {
                  if (option?.value) {
                    setRequest(String(option.value))
                    setQuery('')
                    setResults('')
                    if (
                      option.value === 'find_objects' ||
                      option.value === 'find_users'
                    ) {
                      setSubjectType('user')
                      setSubjectInstance(null)
                      setObjectInstance(null)
                    }
                  }
                }}
              />
            </HeaderSelectContainer>
          </Row>
        </Row>
      </Header>
      <SubContainer>
        <LeftContainer>
          {['check', 'find_objects'].includes(request) && (
            <ObjectDiv>
              {request === 'check' && (
                <Select
                  label="Subject Type"
                  options={objectTypes}
                  value={objectTypes.find(({ value }) => value === subjectType)}
                  onChange={(option) => {
                    if (option?.value) {
                      setSubjectType(String(option.value))
                      setSubjectInstance(null)
                    }
                  }}
                />
              )}
              <Select
                label="Subject"
                options={subjects}
                value={subjectInstance}
                onChange={setSubjectInstance}
                onMenuScrollToBottom={() => {
                  if (hasMoreSubjects && fetchNextSubjectsData) {
                    fetchNextSubjectsData()
                  }
                }}
              />
            </ObjectDiv>
          )}
          {[
            'check',
            'find_objects',
            'find_users',
            'object',
            'objects',
            'relations',
          ].includes(request) && (
            <ObjectDiv>
              <Select
                label="Object Type"
                options={objectTypes}
                value={objectTypes.find(({ value }) => value === objectType)}
                onChange={(option) => {
                  if (option?.value) {
                    setObjectType(String(option.value))
                    setObjectInstance(null)
                    setRelationType(null)
                  }
                }}
              />
              {!['find_objects', 'objects'].includes(request) && (
                <Select
                  label="Instance"
                  options={objectInstances}
                  value={objectInstance}
                  onChange={setObjectInstance}
                  onMenuScrollToBottom={() => {
                    if (hasMoreObjects && fetchMoreObjects) {
                      fetchMoreObjects()
                    }
                  }}
                />
              )}
            </ObjectDiv>
          )}
          {['check', 'find_objects', 'find_users'].includes(request) && (
            <Select
              label="Relation"
              modifyCustomStyle={() => colourStyles}
              options={relationsPermissions}
              value={relationType}
              onChange={setRelationType}
            />
          )}
        </LeftContainer>
      </SubContainer>
      {!!request && (
        <PlayButtonHeader>
          <Row $centered style={{ height: '100%', justifyContent: 'center' }}>
            <PlayButton disabled={disableButton} onSubmit={evaluate} />
          </Row>
        </PlayButtonHeader>
      )}
      <SubContainer>
        {!!request && (
          <Header>
            <Row $centered style={{ height: '100%' }}>
              <SmallScreenPlayDiv>
                <PlayButton disabled={disableButton} onSubmit={evaluate} />
              </SmallScreenPlayDiv>
              <div style={{ flex: 1, marginLeft: 20 }}>
                <HeaderTitle>OUTPUT:</HeaderTitle>
              </div>
            </Row>
          </Header>
        )}
        <RightContainer>
          <>
            <EvaluatorContainer>
              <EvaluatorLabel>Request</EvaluatorLabel>
              <ButtonsContainer>
                <CopyButton
                  disabled={!query}
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    copyCurlRest()
                  }}
                >
                  Copy as cURL
                </CopyButton>
              </ButtonsContainer>
            </EvaluatorContainer>
            <TextBox $margin={11}>
              <Highlight language="json">
                {JSON.stringify(getPayload(request), emptyReplacer, 2)}
              </Highlight>
            </TextBox>
          </>

          <br></br>
          <ResultsContainer>
            <Label>Results</Label>
          </ResultsContainer>
          <TextBox>
            <Highlight language="json">{results || ''}</Highlight>
          </TextBox>
        </RightContainer>
      </SubContainer>
    </Container>
  )
}

export default DirectoryEvaluator
