import React, { useCallback, useEffect, useMemo, useState } from 'react'

import {
  useAuthorizerDecisionTree,
  useAuthorizerIs,
  useAuthorizerQuery,
  usePoliciesList,
} from '../../../../api/v3/authorizer'
import ensureError from '../../../../lib/error/ensureError'
import {
  AuthorizerOperation,
  useContentPolicyEvaluatorContext,
  usePolicyEvaluatorErrorContext,
} from '../../../../services/PolicyEvaluatorContextProvider/hooks'
import {
  V2DecisionTreeRequest,
  V2DecisionTreeResponse,
  V2IsRequest,
  V2IsResponse,
  V2QueryRequest,
  V2QueryResponse,
} from '../../../../types/authorizer'
import PolicyEvaluatorContent from './EvaluatorContent'

type EvaluatorProps = {
  isRebac?: boolean
  selectedModuleId?: null | string
}

const Evaluator: React.FC<EvaluatorProps> = ({ isRebac, selectedModuleId }) => {
  const { mutateAsync: getAuthzQuery } = useAuthorizerQuery()
  const { mutateAsync: getAuthzIs } = useAuthorizerIs()
  const { mutateAsync: getAuthzDecisiontree } = useAuthorizerDecisionTree()
  const [output, setOutput] = useState<
    string | V2DecisionTreeResponse | V2IsResponse | V2QueryResponse
  >()
  const [requestBody, setRequestBody] = useState<
    V2DecisionTreeRequest | V2IsRequest | V2QueryRequest
  >()
  const { data: listPolicyModules } = usePoliciesList({
    field_mask: 'id,package_path,raw',
  })
  const [filter, setFilter] = useState<string>('')

  const policyModules = useMemo(() => {
    if (!listPolicyModules || !listPolicyModules.result) {
      return
    }
    return listPolicyModules.result
      .map((module) => {
        return {
          id: module.id,
          package_path: module.package_path?.replace('data.', ''),
          raw: module.raw,
        }
      })
      .sort((a, b) => (a.package_path! < b.package_path! ? -1 : 1))
  }, [listPolicyModules])

  const getOperationBasedOnType = (type: AuthorizerOperation) => {
    const operationsObj = {
      CHECK: getAuthzIs,
      DECISIONTREE: getAuthzDecisiontree,
      IS: getAuthzIs,
      QUERY: getAuthzQuery,
    }

    return operationsObj[type]
  }

  const onExecute = async (
    type: AuthorizerOperation,
    body: V2DecisionTreeRequest | V2IsRequest | V2QueryRequest,
  ) => {
    const operation = getOperationBasedOnType(type)
    try {
      const responseData = await operation({ data: body })
      setOutput(responseData)
    } catch (error) {
      setOutput(ensureError(error).message)
    } finally {
      window.scrollTo(0, 0)
    }
  }

  const evaluatorContext = useContentPolicyEvaluatorContext()

  const {
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
    request,
    resourceContext,
    type,
  } = evaluatorContext

  const { setPolicyContextError, setResourceContextError } =
    usePolicyEvaluatorErrorContext()
  const generateResourceContext = useCallback(() => {
    setResourceContextError?.(undefined)
    try {
      return {
        ...(resourceContext && {
          resource_context: JSON.parse(resourceContext || '{}'),
        }),
      }
    } catch {
      setResourceContextError('Resource context is not a valid JSON.')
      return {}
    }
  }, [resourceContext, setResourceContextError])

  const generatePolicyContext = useCallback(() => {
    setPolicyContextError(undefined)
    try {
      if (request === AuthorizerOperation.CHECK) {
        return {
          policy_context: {
            decisions: ['allowed'],
            path: 'rebac.check',
          },
        }
      }
      return {
        ...(decisions && {
          policy_context: {
            decisions: JSON.parse(decisions || '[]'),
            path: request === 'IS' ? pathSelect : pathFreeText,
          },
        }),
      }
    } catch (error) {
      setPolicyContextError(
        `Decisions: "${decisions}" is not a valid array. \n Error: ${error}`,
      )
      return {}
    }
  }, [decisions, pathFreeText, pathSelect, request, setPolicyContextError])

  const generateIdentityContext = useCallback(() => {
    return {
      identity_context: {
        identity: identity!,
        type,
      },
    }
  }, [identity, type])

  const generateQueryOptions = useCallback(() => {
    return {
      metrics: !!queryMetrics,
      trace: queryTrace ? queryTraceLevel : undefined,
      trace_summary: !!queryTraceSummary,
    }
  }, [queryMetrics, queryTrace, queryTraceLevel, queryTraceSummary])

  useEffect(() => {
    const policyInstanceContextRequest = {}

    const resourceContextRequest = generateResourceContext()
    const policyContextRequest = generatePolicyContext()
    const identityContextRequest = generateIdentityContext()
    const queryOptions = generateQueryOptions()

    const payload = {
      ...identityContextRequest,
      ...(request === AuthorizerOperation.DECISIONTREE && {
        options: {
          path_separator: options,
        },
      }),
      ...(request === AuthorizerOperation.QUERY && query && { query }),
      ...(request === AuthorizerOperation.QUERY && input && { input }),
      ...(request === AuthorizerOperation.QUERY && {
        options: queryOptions,
      }),
      ...resourceContextRequest,
      ...policyContextRequest,
      ...policyInstanceContextRequest,
    }
    setRequestBody(payload)
  }, [
    generateResourceContext,
    generatePolicyContext,
    generateIdentityContext,
    generateQueryOptions,
    request,
    options,
    query,
    input,
  ])

  const onSubmit = () => {
    return onExecute(request, requestBody!)
  }

  return (
    <PolicyEvaluatorContent
      data-testid="evaluator-component"
      filter={filter}
      isRebac={isRebac}
      output={output}
      policyModules={policyModules}
      requestBody={requestBody}
      selectedModuleId={selectedModuleId}
      setFilter={setFilter}
      onRequestChange={() => setOutput('')}
      onSubmit={onSubmit}
    />
  )
}

export default Evaluator
