import React, { useContext } from "react"

import { SelectOption } from "../../components/common/Select"
import { ApiIdentityType, V2PathSeparator, V2TraceLevel } from "../../types/authorizer"

export type AuthorizerOperation = typeof AuthorizerOperation[keyof typeof AuthorizerOperation];
export const AuthorizerOperation = {
  CHECK: 'CHECK',
  DECISIONTREE: 'DECISIONTREE',
  IS: 'IS',
  QUERY: 'QUERY',
} as const;

type PolicyEvaluatorActiveInstanceProps = {
  policyInstance: string
  setPolicyInstance: React.Dispatch<React.SetStateAction<string>>
}

type PolicyEvaluatorContextForCommonProps = {
  decisions: string
  resourceContext: string
  setDecisions: React.Dispatch<React.SetStateAction<string>>
  setResourceContext: React.Dispatch<React.SetStateAction<string>>
}
 type PolicyEvaluatorContextForContentProps = {
  decisions: string
  identity: null | string
  input: string
  options: V2PathSeparator
  pathFreeText: string
  pathSelect: string
  query: string
  queryMetrics: boolean
  queryTrace: boolean
  queryTraceLevel: V2TraceLevel
  queryTraceSummary: boolean
  request: AuthorizerOperation
  resourceContext: string
  setIdentity: React.Dispatch<React.SetStateAction<null | string>>
  setRequest: React.Dispatch<React.SetStateAction<AuthorizerOperation>>
  setType: React.Dispatch<React.SetStateAction<ApiIdentityType>>
  type: ApiIdentityType
}
 type PolicyEvaluatorContextForDecisionTreeProps = {
  options: V2PathSeparator
  pathFreeText: string
  setOptions: React.Dispatch<React.SetStateAction<V2PathSeparator>>
  setPathFreeText: React.Dispatch<React.SetStateAction<string>>
}

 type PolicyEvaluatorContextForIsProps = {
  pathSelect: string
  setPathSelect: (path: string) => void
}

type PolicyEvaluatorContextForQueryProps = {
  input: string
  pathFreeText: string
  query: string
  queryMetrics: boolean
  queryTrace: boolean
  queryTraceLevel: V2TraceLevel
  queryTraceSummary: boolean
  setInput: React.Dispatch<React.SetStateAction<string>>
  setPathFreeText: React.Dispatch<React.SetStateAction<string>>
  setQuery: React.Dispatch<React.SetStateAction<string>>
  setQueryMetrics: React.Dispatch<React.SetStateAction<boolean>>
  setQueryTrace: React.Dispatch<React.SetStateAction<boolean>>
  setQueryTraceLevel: React.Dispatch<React.SetStateAction<V2TraceLevel>>
  setQueryTraceSummary: React.Dispatch<React.SetStateAction<boolean>>
}
type PolicyEvaluatorContextForRebacProps = {
  objectInstance: null | SelectOption
  objectType: string
  permission: null | SelectOption
  relationType: null | SelectOption
  setObjectInstance: React.Dispatch<React.SetStateAction<null | SelectOption>>
  setObjectType: React.Dispatch<React.SetStateAction<string>>
  setPermission: React.Dispatch<React.SetStateAction<null | SelectOption>>
  setRelationType: React.Dispatch<React.SetStateAction<null | SelectOption>>
  setSubjectInstance: React.Dispatch<React.SetStateAction<null | SelectOption>>
  setSubjectType: React.Dispatch<React.SetStateAction<string>>
  subjectInstance: null | SelectOption
  subjectType: string
}
type PolicyEvaluatorContextProps =
  | PolicyEvaluatorActiveInstanceProps
  | PolicyEvaluatorContextForCommonProps
  | PolicyEvaluatorContextForContentProps
  | PolicyEvaluatorContextForDecisionTreeProps
  | PolicyEvaluatorContextForIsProps
  | PolicyEvaluatorContextForQueryProps
  | PolicyEvaluatorContextForRebacProps
  | PolicyEvaluatorErrorContextProps
type PolicyEvaluatorErrorContextProps = {
  policyContextError: string | undefined
  resourceContextError: string | undefined
  setPolicyContextError: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
  setResourceContextError: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
}

export const PolicyEvaluatorContext = React.createContext<PolicyEvaluatorContextProps>(
  {
    decisions: '["allowed", "visible", "enabled"]',
    identity: null,
    input: '',
    objectInstance: { label: '', value: '' },
    objectType: '',
    options: 'PATH_SEPARATOR_DOT',
    pathFreeText: '',
    pathSelect: '',
    permission: { label: '', value: '' },
    policyContextError: undefined,
    policyInstance: '',
    query: '',
    queryMetrics: false,
    queryTrace: false,
    queryTraceLevel: 'TRACE_LEVEL_NOTES',
    queryTraceSummary: false,
    relationType: { label: '', value: '' },
    request: 'IS',
    resourceContext: '',
    setDecisions: () => {},
    setIdentity: () => {},
    setInput: () => {},
    setObjectInstance: () => {},
    setObjectType: () => {},
    setOptions: () => {},
    setPathFreeText: () => {},
    setPathSelect: () => {},
    setPermission: () => {},
    setPolicyContextError: () => {},
    setPolicyInstance: () => {},
    setQuery: () => {},
    setRelationType: () => {},
    setRequest: () => {},
    setResourceContext: () => {},
    setSubjectInstance: () => {},
    setSubjectType: () => {},
    setType: () => {},
    subjectInstance: { label: '', value: '' },
    subjectType: '',
    type: 'IDENTITY_TYPE_NONE',
  },
)

export const usePolicyEvaluatorErrorContext = () =>
  useContext(PolicyEvaluatorContext) as PolicyEvaluatorErrorContextProps

export const useDecisionTreePolicyEvaluatorContext = () =>
  useContext(
    PolicyEvaluatorContext,
  ) as PolicyEvaluatorContextForDecisionTreeProps

export const useQueryPolicyEvaluatorContext = () =>
  useContext(PolicyEvaluatorContext) as PolicyEvaluatorContextForQueryProps

export const useCommonPolicyEvaluatorContext = () =>
  useContext(PolicyEvaluatorContext) as PolicyEvaluatorContextForCommonProps

export const useIsPolicyEvaluatorContext = () =>
  useContext(PolicyEvaluatorContext) as PolicyEvaluatorContextForIsProps

export const useRebacPolicyEvaluatorContext = () =>
  useContext(PolicyEvaluatorContext) as PolicyEvaluatorContextForRebacProps

export const useContentPolicyEvaluatorContext = () =>
  useContext(PolicyEvaluatorContext) as PolicyEvaluatorContextForContentProps

