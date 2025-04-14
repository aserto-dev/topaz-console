import React, { useContext } from "react"
import { V2PathSeparator, V2TraceLevel, ApiIdentityType } from "../../types/authorizer"
import { SelectOption } from "../../components/common/Select"

export type AuthorizerOperation = 'QUERY' | 'DECISIONTREE' | 'IS' | 'CHECK'

type PolicyEvaluatorContextProps =
  | PolicyEvaluatorContextForIsProps
  | PolicyEvaluatorContextForCommonProps
  | PolicyEvaluatorContextForDecisionTreeProps
  | PolicyEvaluatorContextForQueryProps
  | PolicyEvaluatorContextForContentProps
  | PolicyEvaluatorContextForRebacProps
  | PolicyEvaluatorErrorContextProps
  | PolicyEvaluatorActiveInstanceProps

export type PolicyEvaluatorContextForContentProps = {
  decisions: string
  identity: string | null
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
  setIdentity: React.Dispatch<React.SetStateAction<string | null>>
  setRequest: React.Dispatch<React.SetStateAction<AuthorizerOperation>>
  setType: React.Dispatch<React.SetStateAction<ApiIdentityType>>
  type: ApiIdentityType
}
export type PolicyEvaluatorActiveInstanceProps = {
  policyInstance: string
  setPolicyInstance: React.Dispatch<React.SetStateAction<string>>
}
export type PolicyEvaluatorErrorContextProps = {
  resourceContextError: string | undefined
  setResourceContextError: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
  policyContextError: string | undefined
  setPolicyContextError: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
}

export type PolicyEvaluatorContextForRebacProps = {
  subjectType: string
  subjectInstance: SelectOption | null
  permission: SelectOption | null
  relationType: SelectOption | null
  objectType: string
  objectInstance: SelectOption | null
  setSubjectType: React.Dispatch<React.SetStateAction<string>>
  setSubjectInstance: React.Dispatch<React.SetStateAction<SelectOption | null>>
  setPermission: React.Dispatch<React.SetStateAction<SelectOption | null>>
  setRelationType: React.Dispatch<React.SetStateAction<SelectOption | null>>
  setObjectType: React.Dispatch<React.SetStateAction<string>>
  setObjectInstance: React.Dispatch<React.SetStateAction<SelectOption | null>>
}

type PolicyEvaluatorContextForIsProps = {
  pathSelect: string
  setPathSelect: (path: string) => void
}
type PolicyEvaluatorContextForDecisionTreeProps = {
  options: V2PathSeparator
  pathFreeText: string
  setOptions: React.Dispatch<React.SetStateAction<V2PathSeparator>>
  setPathFreeText: React.Dispatch<React.SetStateAction<string>>
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
type PolicyEvaluatorContextForCommonProps = {
  decisions: string
  resourceContext: string
  setDecisions: React.Dispatch<React.SetStateAction<string>>
  setResourceContext: React.Dispatch<React.SetStateAction<string>>
}

export const PolicyEvaluatorContext = React.createContext<PolicyEvaluatorContextProps>(
  {
    decisions: '["allowed", "visible", "enabled"]',
    identity: null,
    input: '',
    options: 'PATH_SEPARATOR_DOT',
    pathFreeText: '',
    pathSelect: '',
    policyInstance: '',
    query: '',
    queryMetrics: false,
    queryTrace: false,
    queryTraceLevel: 'TRACE_LEVEL_NOTES',
    queryTraceSummary: false,
    request: 'IS',
    resourceContext: '',
    type: 'IDENTITY_TYPE_NONE',
    setDecisions: () => {},
    setIdentity: () => {},
    setInput: () => {},
    setOptions: () => {},
    setPathFreeText: () => {},
    setPathSelect: () => {},
    setPolicyInstance: () => {},
    setQuery: () => {},
    setRequest: () => {},
    setResourceContext: () => {},
    setType: () => {},
    subjectType: '',
    subjectInstance: { label: '', value: '' },
    permission: { label: '', value: '' },
    relationType: { label: '', value: '' },
    objectType: '',
    objectInstance: { label: '', value: '' },
    setSubjectType: () => {},
    setSubjectInstance: () => {},
    setPermission: () => {},
    setRelationType: () => {},
    setObjectType: () => {},
    setObjectInstance: () => {},
    setPolicyContextError: () => {},
    policyContextError: undefined,
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

export const useActivePolicyInstanceContext = () =>
  useContext(PolicyEvaluatorContext) as PolicyEvaluatorActiveInstanceProps
