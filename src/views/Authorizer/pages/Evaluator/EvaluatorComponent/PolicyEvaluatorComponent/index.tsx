import React, { Dispatch } from 'react'

import {
  ApiModule,
  V2DecisionTreeRequest,
  V2DecisionTreeResponse,
  V2IsRequest,
  V2IsResponse,
  V2QueryRequest,
  V2QueryResponse,
} from '../../../../../../types/authorizer'
import { PolicyEvaluatorContent } from './PolicyEvaluatorContent'

export type PolicyEvaluatorProps = {
  fetchNextUsersData?: () => object
  filter?: string
  hasMoreUsers?: boolean
  isRebac?: boolean
  onRequestChange?: () => void
  onSubmit: () => void
  output:
    | string
    | undefined
    | V2DecisionTreeResponse
    | V2IsResponse
    | V2QueryResponse
  policyModules: Array<ApiModule> | undefined
  requestBody?: V2DecisionTreeRequest | V2IsRequest | V2QueryRequest
  selectedModuleId?: null | string
  setFilter?: Dispatch<React.SetStateAction<string>>
}

export const PolicyEvaluatorComponent: React.FC<PolicyEvaluatorProps> = (
  props,
) => <PolicyEvaluatorContent {...props} />
