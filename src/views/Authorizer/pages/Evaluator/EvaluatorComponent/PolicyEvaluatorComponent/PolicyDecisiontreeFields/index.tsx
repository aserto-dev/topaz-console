import { Decisions } from '../PolicyCommonFields/Decisions'
import { ResourceContext } from '../PolicyCommonFields/ResourceContext'
import { FieldContainer, SectionTitleContainer } from '../styles'
import { SubField } from '../Subfield'
import Select, {
  SelectOption,
} from '../../../../../../../components/common/Select'
import { useDecisionTreePolicyEvaluatorContext } from '../../../../../../../services/PolicyEvaluatorContextProvider/hooks'
import { V2PathSeparator } from '../../../../../../../types/authorizer'
import Label from '../../../../../../../components/common/Label'
import { Row } from '../../../../../../../components/common/Row'
import Input from '../../../../../../../components/common/Input'

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
  const { options, setOptions, pathFreeText, setPathFreeText } =
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
              defaultValue={pathFreeText}
              label="Path"
              placeholder="Policy path"
              onChange={(e) => setPathFreeText(e.target.value)}
            />
          </FieldContainer>
        </Row>
      </SubField>
      <Decisions />
      <ResourceContext />
    </div>
  )
}
