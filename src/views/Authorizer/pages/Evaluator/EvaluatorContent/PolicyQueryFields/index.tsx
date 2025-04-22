import Checkbox from '../../../../../../components/common/Checkbox'
import Input from '../../../../../../components/common/Input'
import Label from '../../../../../../components/common/Label'
import { Row } from '../../../../../../components/common/Row'
import Select, {
  SelectOption,
} from '../../../../../../components/common/Select'
import TextArea from '../../../../../../components/common/TextArea'
import { useQueryPolicyEvaluatorContext } from '../../../../../../services/PolicyEvaluatorContextProvider/hooks'
import { V2TraceLevel } from '../../../../../../types/authorizer'
import { Decisions } from '../PolicyCommonFields/Decisions'
import { ResourceContext } from '../PolicyCommonFields/ResourceContext'
import {
  FieldContainer,
  QueryOptionsContainer,
  SectionTitleContainer,
  SelectTraceContainer,
} from '../styles'
import { SubField } from '../Subfield'

export const PolicyQueryFields = () => {
  const queryPolicyEvaluatorContext = useQueryPolicyEvaluatorContext()

  const {
    input,
    pathFreeText,
    query,
    queryMetrics,
    queryTrace,
    queryTraceLevel,
    queryTraceSummary,
    setInput,
    setPathFreeText,
    setQuery,
    setQueryMetrics,
    setQueryTrace,
    setQueryTraceLevel,
    setQueryTraceSummary,
  } = queryPolicyEvaluatorContext

  const traceOptions: Array<SelectOption> = [
    {
      label: 'TRACE_LEVEL_NOTES',
      value: 'TRACE_LEVEL_NOTES',
    },
    {
      label: 'TRACE_LEVEL_OFF',
      value: 'TRACE_LEVEL_OFF',
    },
    {
      label: 'TRACE_LEVEL_FULL',
      value: 'TRACE_LEVEL_FULL',
    },
    {
      label: 'TRACE_LEVEL_FAILS',
      value: 'TRACE_LEVEL_FAILS',
    },
  ]

  return (
    <>
      <FieldContainer>
        <Label htmlFor="queryOptions">Options</Label>
        <QueryOptionsContainer>
          <SelectTraceContainer>
            <Checkbox
              checked={queryTrace}
              label="Trace"
              onChange={setQueryTrace}
            />
            {queryTrace && (
              <Select
                name="trace-select"
                options={traceOptions}
                value={
                  traceOptions.find(
                    (option) => option.value === queryTraceLevel,
                  ) || traceOptions[0]
                }
                onChange={(option) => {
                  if (option?.value) {
                    setQueryTraceLevel(option.value as V2TraceLevel)
                  }
                }}
              />
            )}
          </SelectTraceContainer>
          <Checkbox
            checked={queryTraceSummary}
            label="Trace Summary"
            onChange={setQueryTraceSummary}
          />
          <Checkbox
            checked={queryMetrics}
            label="Metrics"
            onChange={setQueryMetrics}
          />
        </QueryOptionsContainer>
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
              value={pathFreeText || ''}
              onChange={(e) => setPathFreeText(e.target.value || '')}
            />
          </FieldContainer>
        </Row>
      </SubField>
      <Decisions />
      <FieldContainer>
        <Label htmlFor="query">Query</Label>
        <TextArea
          id="query"
          placeholder="x = data; y = input"
          rows={10}
          value={String(query)}
          onChange={(e) => {
            setQuery(e.target.value)
          }}
        />
      </FieldContainer>
      <FieldContainer>
        <Label htmlFor="input">Input</Label>
        <TextArea
          id="input"
          placeholder='{ "foo": "bar" }'
          rows={10}
          value={String(input)}
          onChange={(e) => {
            setInput(e.target.value)
          }}
        />
      </FieldContainer>
      <ResourceContext />
    </>
  )
}
