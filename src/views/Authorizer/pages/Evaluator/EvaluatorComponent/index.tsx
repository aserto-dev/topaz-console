import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { PolicyEvaluatorComponent } from './PolicyEvaluatorComponent'
import {
  useAuthorizerQuery,
  useAuthorizerIs,
  useAuthorizerDecisionTree,
  usePoliciesList,
} from '../../../../../api/v3/authorizer'
import {
  V2DecisionTreeRequest,
  V2DecisionTreeResponse,
  V2IsRequest,
  V2IsResponse,
  V2QueryRequest,
  V2QueryResponse,
} from '../../../../../types/authorizer'
import {
  AuthorizerOperation,
  useContentPolicyEvaluatorContext,
  usePolicyEvaluatorErrorContext,
} from '../../../../../services/PolicyEvaluatorContextProvider/hooks'
import ensureError from '../../../../../lib/error/ensureError'
type EvaluatorProps = {
  isRebac?: boolean
  selectedModuleId?: string | null
}

export const Evaluator: React.FC<EvaluatorProps> = ({
  isRebac,
  selectedModuleId,
}) => {
  const { mutateAsync: getAuthzQuery } = useAuthorizerQuery()
  const { mutateAsync: getAuthzIs } = useAuthorizerIs()
  const { mutateAsync: getAuthzDecisiontree } = useAuthorizerDecisionTree()
  const [output, setOutput] = useState<
    V2QueryResponse | V2IsResponse | V2DecisionTreeResponse | string
  >()
  const [requestBody, setRequestBody] = useState<
    V2QueryRequest | V2IsRequest | V2DecisionTreeRequest
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
      QUERY: getAuthzQuery,
      IS: getAuthzIs,
      DECISIONTREE: getAuthzDecisiontree,
      CHECK: getAuthzIs,
    }

    return operationsObj[type]
  }

  const onExecute = async (
    type: AuthorizerOperation,
    body: V2QueryRequest | V2IsRequest | V2DecisionTreeRequest,
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

  const pathSelect = evaluatorContext.pathSelect
  const request = evaluatorContext.request
  const decisions = evaluatorContext.decisions
  const resourceContext = evaluatorContext.resourceContext
  const input = evaluatorContext.input
  const query = evaluatorContext.query
  const queryMetrics = evaluatorContext.queryMetrics
  const queryTrace = evaluatorContext.queryTrace
  const queryTraceLevel = evaluatorContext.queryTraceLevel
  const queryTraceSummary = evaluatorContext.queryTraceSummary
  const pathFreeText = evaluatorContext.pathFreeText
  const options = evaluatorContext.options
  const identity = evaluatorContext.identity
  const type = evaluatorContext.type

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
        type,
        identity: identity!,
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
    <PolicyEvaluatorComponent
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
