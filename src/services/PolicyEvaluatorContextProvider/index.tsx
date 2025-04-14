import React, { useCallback, useMemo, useState } from 'react'

import { SelectOption } from '../../components/common/Select'
import { ApiIdentityType, V2TraceLevel } from '../../types/authorizer'
import { PolicyEvaluatorContext } from './hooks'

export const PolicyEvaluatorContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [subjectType, setSubjectType] = useState('')
  const [permission, setPermission] = useState<SelectOption | null>(null)
  const [policyContextError, setPolicyContextError] = useState<
    string | undefined
  >()
  const [resourceContextError, setResourceContextError] = useState<
    string | undefined
  >()
  const [policyContextState, setPolicyContextState] = useState<string>('{}')
  const [policyInstance, setPolicyInstance] = useState('topaz')

  const getFieldContextState = useCallback(
    (fieldName: string) => {
      try {
        const json = JSON.parse(policyContextState || '{}')
        if (json && policyInstance) {
          if (
            ['queryMetrics', 'queryTrace', 'queryTraceSummary'].includes(
              fieldName,
            )
          ) {
            return (
              (json[policyInstance] && json[policyInstance][fieldName]) || false
            )
          }
          return (
            (json[policyInstance] &&
              String(json[policyInstance][fieldName] || '')) ||
            ''
          )
        }
      } catch {
        /* empty */
      }
      return ''
    },
    [policyContextState, policyInstance],
  )

  const setFieldContextState = useCallback(
    (field: string, value: string | boolean) => {
      setPolicyContextState((prevState) => {
        try {
          const json = JSON.parse(prevState || '{}')
          if (json && policyInstance) {
            return JSON.stringify({
              ...json,
              [policyInstance]: { ...json[policyInstance], [field]: value },
            })
          }
        } catch {
          /* empty */
        }
        return prevState
      })
    },
    [policyInstance, setPolicyContextState],
  )

  const deleteContextStateField = useCallback(
    (field: string) => {
      setPolicyContextState((prevState) => {
        try {
          const json = JSON.parse(prevState || '{}')
          if (
            json &&
            policyInstance &&
            json[policyInstance] &&
            json[policyInstance][field]
          ) {
            delete json[policyInstance][field]
            return JSON.stringify(json)
          }
        } catch {
          /* empty */
        }
        return prevState
      })
    },
    [policyInstance, setPolicyContextState],
  )

  const objectType = useMemo(() => {
    return getFieldContextState('object_type') || null
  }, [getFieldContextState])

  const setObjectType = useCallback(
    (value: string) => {
      setFieldContextState('object_type', value)
    },
    [setFieldContextState],
  )

  const options = useMemo(() => {
    return getFieldContextState('options') || 'PATH_SEPARATOR_DOT'
  }, [getFieldContextState])

  const setOptions = useCallback(
    (value: string) => {
      setFieldContextState('options', value)
    },
    [setFieldContextState],
  )
  const resourceContext = useMemo(
    () => getFieldContextState('resource_context'),
    [getFieldContextState],
  )
  const setResourceContext = useCallback(
    (resourceContext: string) => {
      setFieldContextState('resource_context', resourceContext)
    },
    [setFieldContextState],
  )
  const request = useMemo(() => {
    return getFieldContextState('request') || ''
  }, [getFieldContextState])

  const setRequest = useCallback(
    (value: string) => {
      setFieldContextState('request', value)
    },
    [setFieldContextState],
  )

  const type = useMemo(() => {
    const type = getFieldContextState('type')
    return type || 'IDENTITY_TYPE_NONE'
  }, [getFieldContextState])

  const setType = useCallback(
    (type: ApiIdentityType) => {
      setFieldContextState('type', type)
    },
    [setFieldContextState],
  )
  const subjectInstance = useMemo(() => {
    const subject = getFieldContextState('subject')
    return (subject && JSON.parse(subject)) || null
  }, [getFieldContextState])

  const setSubjectInstance = useCallback(
    (instance: SelectOption | null) => {
      if (instance) {
        setFieldContextState('subject', JSON.stringify(instance))
      } else {
        deleteContextStateField('subject')
      }
    },
    [deleteContextStateField, setFieldContextState],
  )

  const objectInstance = useMemo(() => {
    const object = getFieldContextState('object')
    return (object && (JSON.parse(object) as SelectOption)) || null
  }, [getFieldContextState])

  const setObjectInstance = useCallback(
    (object: SelectOption | null) => {
      if (object) {
        setFieldContextState('object', JSON.stringify(object))
      } else {
        deleteContextStateField('object')
      }
    },
    [deleteContextStateField, setFieldContextState],
  )
  const relationType = useMemo(() => {
    const relation = getFieldContextState('relation_type')
    return (relation && (JSON.parse(relation) as SelectOption)) || null
  }, [getFieldContextState])

  const setRelationType = useCallback(
    (relation: SelectOption | null) => {
      if (relation) {
        setFieldContextState('relation_type', JSON.stringify(relation))
      } else {
        deleteContextStateField('relation_type')
      }
    },
    [deleteContextStateField, setFieldContextState],
  )
  const identity = useMemo(() => {
    return getFieldContextState('identity')
  }, [getFieldContextState])

  const setIdentity = useCallback(
    (value: string | null) => {
      if (value) {
        setFieldContextState('identity', value)
      } else {
        deleteContextStateField('identity')
      }
    },
    [deleteContextStateField, setFieldContextState],
  )
  const input = useMemo(() => {
    return getFieldContextState('input')
  }, [getFieldContextState])

  const setInput = useCallback(
    (value: string) => {
      setFieldContextState('input', value)
    },
    [setFieldContextState],
  )
  const decisions = useMemo(() => {
    return getFieldContextState('decisions') || '["allowed"]'
  }, [getFieldContextState])

  const setDecisions = useCallback(
    (value: string) => {
      setFieldContextState('decisions', value)
    },
    [setFieldContextState],
  )
  const pathFreeText = useMemo(() => {
    return getFieldContextState('path_free_text')
  }, [getFieldContextState])

  const setPathFreeText = useCallback(
    (value: string) => {
      setFieldContextState('path_free_text', value)
    },
    [setFieldContextState],
  )
  const pathSelect = useMemo(() => {
    return getFieldContextState('path_select')
  }, [getFieldContextState])

  const setPathSelect = useCallback(
    (path: string) => {
      setFieldContextState('path_select', path)
    },
    [setFieldContextState],
  )
  const query = useMemo(() => {
    return getFieldContextState('query')
  }, [getFieldContextState])

  const setQuery = useCallback(
    (value: string) => {
      setFieldContextState('query', value)
    },
    [setFieldContextState],
  )

  const queryMetrics = useMemo(() => {
    return getFieldContextState('queryMetrics')
  }, [getFieldContextState])

  const setQueryMetrics = useCallback(
    (value: boolean) => {
      setFieldContextState('queryMetrics', value)
    },
    [setFieldContextState],
  )

  const queryTrace = useMemo(() => {
    return getFieldContextState('queryTrace')
  }, [getFieldContextState])

  const setQueryTrace = useCallback(
    (value: boolean) => {
      setFieldContextState('queryTrace', value)
    },
    [setFieldContextState],
  )

  const queryTraceLevel = useMemo(() => {
    return getFieldContextState('queryTraceLevel') || 'TRACE_LEVEL_NOTES'
  }, [getFieldContextState])

  const setQueryTraceLevel = useCallback(
    (value: V2TraceLevel) => {
      setFieldContextState('queryTraceLevel', value)
    },
    [setFieldContextState],
  )

  const queryTraceSummary = useMemo(() => {
    return getFieldContextState('queryTraceSummary')
  }, [getFieldContextState])

  const setQueryTraceSummary = useCallback(
    (value: boolean) => {
      setFieldContextState('queryTraceSummary', value)
    },
    [setFieldContextState],
  )

  const value = useMemo(
    () => ({
      decisions,
      identity,
      input,
      options,
      pathFreeText,
      pathSelect,
      query,
      queryMetrics,
      queryTrace,
      queryTraceLevel,
      queryTraceSummary,
      resourceContext,
      request,
      setDecisions,
      setIdentity,
      setInput,
      setOptions,
      setPathFreeText,
      setPathSelect,
      setQuery,
      setQueryMetrics,
      setQueryTrace,
      setQueryTraceLevel,
      setQueryTraceSummary,
      setRequest,
      setResourceContext,
      setType,
      type,
      subjectType,
      subjectInstance,
      permission,
      relationType,
      objectType,
      objectInstance,
      setSubjectType,
      setSubjectInstance,
      setPermission,
      setRelationType,
      setObjectType,
      setObjectInstance,
      setPolicyInstance,
      policyContextError,
      setPolicyContextError,
      resourceContextError,
      setResourceContextError,
    }),
    [
      decisions,
      identity,
      input,
      options,
      pathFreeText,
      pathSelect,
      query,
      queryMetrics,
      queryTrace,
      queryTraceLevel,
      queryTraceSummary,
      resourceContext,
      request,
      setDecisions,
      setIdentity,
      setInput,
      setOptions,
      setPathFreeText,
      setPathSelect,
      setQuery,
      setQueryMetrics,
      setQueryTrace,
      setQueryTraceLevel,
      setQueryTraceSummary,
      setRequest,
      setResourceContext,
      setType,
      type,
      subjectType,
      subjectInstance,
      permission,
      relationType,
      objectType,
      objectInstance,
      setSubjectInstance,
      setRelationType,
      setObjectType,
      setObjectInstance,
      policyContextError,
      resourceContextError,
    ],
  )

  return (
    <PolicyEvaluatorContext.Provider value={value}>
      {children}
    </PolicyEvaluatorContext.Provider>
  )
}
