import Input from '../../../../../../components/common/Input'
import Label from '../../../../../../components/common/Label'
import { Row } from '../../../../../../components/common/Row'
import Select, {
  SelectOption,
} from '../../../../../../components/common/Select'
import { useDecisionTreePolicyEvaluatorContext } from '../../../../../../services/PolicyEvaluatorContextProvider/hooks'
import { V2PathSeparator } from '../../../../../../types/authorizer'
import { Decisions } from '../PolicyCommonFields/Decisions'
import { ResourceContext } from '../PolicyCommonFields/ResourceContext'
import { FieldContainer, SectionTitleContainer } from '../styles'
import { SubField } from '../Subfield'

const decisionTreeOptions: Array<SelectOption> = [
  {
    label: 'PATH_SEPARATOR_DOT',
    value: 'PATH_SEPARATOR_DOT',
  },
  {
    label: 'PATH_SEPARATOR_SLASH',
    value: 'PATH_SEPARATOR_SLASH',
  },
]

export const PolicyDecisiontreeFields = () => {
  const { options, pathFreeText, setOptions, setPathFreeText } =
    useDecisionTreePolicyEvaluatorContext()

  return (
    <div>
      <FieldContainer>
        <Select
          label="Options"
          name="decisiontree-options"
          options={decisionTreeOptions}
          value={decisionTreeOptions.find(({ value }) => options === value)}
          onChange={(option) => {
            if (option?.value) {
              setOptions(option?.value as V2PathSeparator)
            }
          }}
        />
      </FieldContainer>
      <SectionTitleContainer>
        <Label>Policy Context</Label>
      </SectionTitleContainer>
      <SubField>
        <Row $centered $marginLeft={20}>
          <FieldContainer>
            <Input
              label="Path"
              placeholder="Policy path"
              value={pathFreeText}
              onChange={(e) => setPathFreeText(e.target.value || '')}
            />
          </FieldContainer>
        </Row>
      </SubField>
      <Decisions />
      <ResourceContext />
    </div>
  )
}
