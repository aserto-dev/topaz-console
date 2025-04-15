import Input from '../../../../../../components/common/Input'
import { Row } from '../../../../../../components/common/Row'
import {
  useCommonPolicyEvaluatorContext,
  usePolicyEvaluatorErrorContext,
} from '../../../../../../services/PolicyEvaluatorContextProvider/hooks'
import { FieldContainer } from '../styles'
import { SubField } from '../Subfield'

export const Decisions = () => {
  const { decisions, setDecisions } = useCommonPolicyEvaluatorContext()
  const { policyContextError } = usePolicyEvaluatorErrorContext()
  return (
    <SubField>
      <Row $centered $marginLeft={20}>
        <FieldContainer>
          <Input
            error={policyContextError}
            label="Decisions"
            value={decisions}
            onChange={(e) => setDecisions(e.target.value)}
          />
        </FieldContainer>
      </Row>
    </SubField>
  )
}
