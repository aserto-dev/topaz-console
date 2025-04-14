import React, { Dispatch } from 'react'

import { PolicyEvaluatorContent } from './PolicyEvaluatorContent'
import {
  ApiModule,
  V2DecisionTreeRequest,
  V2DecisionTreeResponse,
  V2IsRequest,
  V2IsResponse,
  V2QueryRequest,
  V2QueryResponse,
} from '../../../../../../types/authorizer'

export type PolicyEvaluatorProps = {
  output:
    | V2QueryResponse
    | V2IsResponse
    | V2DecisionTreeResponse
    | string
    | undefined
  onSubmit: () => void
  onRequestChange?: () => void
  policyModules: Array<ApiModule> | undefined
  selectedModuleId?: string | null
  filter?: string
  setFilter?: Dispatch<React.SetStateAction<string>>
  hasMoreUsers?: boolean
  fetchNextUsersData?: () => object
  isRebac?: boolean
  requestBody?: V2QueryRequest | V2IsRequest | V2DecisionTreeRequest
}

export const PolicyEvaluatorComponent: React.FC<PolicyEvaluatorProps> = (
  props,
) => <PolicyEvaluatorContent {...props} />
