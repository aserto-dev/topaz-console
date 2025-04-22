import { editor } from 'monaco-editor'
import React, { Dispatch, useEffect, useMemo, useRef, useState } from 'react'

import { Monaco } from '@monaco-editor/react'

import Highlight from '../../../../../components/common/Highlight'
import Label from '../../../../../components/common/Label'
import MonacoEditor from '../../../../../components/common/MonacoEditor'
import { PlayButton } from '../../../../../components/common/PlayButton'
import { Row } from '../../../../../components/common/Row'
import Select, { SelectOption } from '../../../../../components/common/Select'
import {
  AuthorizerOperation,
  useContentPolicyEvaluatorContext,
  usePolicyEvaluatorErrorContext,
  useRebacPolicyEvaluatorContext,
} from '../../../../../services/PolicyEvaluatorContextProvider/hooks'
import { theme } from '../../../../../theme'
import {
  ApiIdentityType,
  ApiModule,
  V2DecisionTreeRequest,
  V2DecisionTreeResponse,
  V2IsRequest,
  V2IsResponse,
  V2QueryRequest,
  V2QueryResponse,
} from '../../../../../types/authorizer'
import { TextBox } from '../../../../Directory/pages/Evaluator/styles'
import { useCopyCurl } from './copyCurl'
import { DecisionTreeTable } from './DecisionTreeTable'
import { PolicyDecisiontreeFields } from './PolicyDecisiontreeFields'
import { PolicyIsFields } from './PolicyIsFields'
import { PolicyQueryFields } from './PolicyQueryFields'
import { RebacEvaluator } from './RebacEvaluator'
import {
  ColumnWrapper,
  Container,
  ContentContainer,
  CopyButton,
  EvaluatorContainer,
  EvaluatorStyledInput,
  FieldContainer,
  Header,
  HeaderSelectContainer,
  HeaderTitle,
  HighlightedOutput,
  ResultsLabel,
  ResultsTextBox,
  SeparationDots,
  SideContent,
  Tab,
  TabGroup,
} from './styles'

type PolicyEvaluatorProps = {
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

const identityOptions: Array<SelectOption> = [
  {
    label: 'Anonymous',
    value: 'IDENTITY_TYPE_NONE',
  },
  {
    label: 'JWT',
    value: 'IDENTITY_TYPE_JWT',
  },
  {
    label: 'Subject',
    value: 'IDENTITY_TYPE_SUB',
  },
  {
    label: 'Manual',
    value: 'IDENTITY_TYPE_MANUAL',
  },
]

const REQUEST_PATHS = {
  CHECK: 'api/V2/authz/is',
  DECISIONTREE: 'api/V2/authz/decisiontree',
  IS: 'api/V2/authz/is',
  QUERY: 'api/V2/authz/query',
}

const MonacoTheme = [
  { foreground: '#A8FF60', token: 'constant' },
  { foreground: '#FF66FF', token: 'number' },
  { foreground: '#FF66FF', token: 'number.hex' },
  { foreground: '#96CBFE', token: 'annotation' },
  { foreground: '#96CBFE', token: 'type' },
  { foreground: '#CCCCCC', token: 'delimiter' },
  { foreground: '#CCCCCC', token: 'delimiter.html' },
  { foreground: '#CCCCCC', token: 'delimiter.xml' },
  { foreground: '#CCCCCC', token: 'editorBracketHighlight' },
  { foreground: '#A8FF60', token: 'metatag.content.html' },
  { foreground: '#96CBFE', token: 'key' },
  { foreground: '#96CBFE', token: 'string.key.json' },
  { foreground: '#A8FF60', token: 'string.value.json' },
  { foreground: '#A8FF60', token: 'attribute.value.unit' },
  { foreground: '#A8FF60', token: 'attribute.value.html' },
  { foreground: '#A8FF60', token: 'attribute.value.xml' },
  { foreground: '#A8FF60', token: 'string' },
  { foreground: '#A8FF60', token: 'string.html' },
  { foreground: '#A8FF60', token: 'string.sql' },
  { foreground: '#A8FF60', token: 'string.yaml' },
  { foreground: '#99CC99', token: 'keyword' },
  { foreground: '#99CC99', token: 'keyword.json' },
  { foreground: '#99CC99', token: 'keyword.flow' },
  { foreground: '#99CC99', token: 'keyword.flow.scss' },
]

function isDecisionTreeResponse(
  output:
    | string
    | undefined
    | V2DecisionTreeResponse
    | V2IsResponse
    | V2QueryResponse,
): output is V2DecisionTreeResponse {
  return (output as V2DecisionTreeResponse)?.path !== undefined
}

const PolicyEvaluatorContent: React.FC<PolicyEvaluatorProps> = ({
  isRebac,
  onRequestChange,
  onSubmit,
  output,
  policyModules,
  requestBody,
}) => {
  const [requestPath, setRequestPath] = useState<string>('')
  const { copyCurl } = useCopyCurl(
    JSON.stringify(requestBody),
    requestPath || REQUEST_PATHS['IS'],
  )

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const {
    identity,
    queryMetrics,
    queryTrace,
    queryTraceSummary,
    request,
    setIdentity,
    setRequest,
    setType,
    type,
  } = useContentPolicyEvaluatorContext()
  const { policyContextError, resourceContextError } =
    usePolicyEvaluatorErrorContext()

  const { setSubjectInstance } = useRebacPolicyEvaluatorContext()
  const requestOptions: Array<SelectOption> = useMemo(
    () =>
      isRebac
        ? [
            {
              label: 'Check ',
              value: AuthorizerOperation.CHECK,
            },
            {
              label: 'Is',
              value: AuthorizerOperation.IS,
            },
            {
              label: 'decisiontree',
              value: AuthorizerOperation.DECISIONTREE,
            },
            {
              label: 'query',
              value: AuthorizerOperation.QUERY,
            },
          ]
        : [
            {
              label: 'Is',
              value: AuthorizerOperation.IS,
            },
            {
              label: 'decisiontree',
              value: AuthorizerOperation.DECISIONTREE,
            },
            {
              label: 'query',
              value: AuthorizerOperation.QUERY,
            },
          ],
    [isRebac],
  )

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    monaco.editor.setTheme('topaz')
    editorRef.current = editor
  }

  useEffect(() => {
    if (!request) {
      const option = requestOptions[0].value as AuthorizerOperation
      setRequest(option)
      setRequestPath(REQUEST_PATHS[option])
    }
  }, [isRebac, request, requestOptions, setRequest, setRequestPath])

  const [activeQueryTab, setActiveQueryTab] = useState<
    'Metrics' | 'Results' | 'Trace' | 'Trace Summary'
  >('Results')

  const queryResult = (output as V2QueryResponse)?.response
  const queryMetricsOutput = (output as V2QueryResponse)?.metrics
  const queryTraceOutput = (output as V2QueryResponse)?.trace
  const queryTraceSummaryOutput = (output as V2QueryResponse)?.trace_summary

  const queryOutput = useMemo(() => {
    if (request === 'QUERY') {
      switch (activeQueryTab) {
        case 'Metrics':
          return queryMetricsOutput
        case 'Results':
          return queryResult
        case 'Trace':
          return queryTraceOutput
        case 'Trace Summary':
          return queryTraceSummaryOutput
        default:
          return
      }
    }
  }, [
    activeQueryTab,
    queryMetricsOutput,
    queryResult,
    queryTraceOutput,
    queryTraceSummaryOutput,
    request,
  ])

  useEffect(() => {
    let outputString: string
    if (request === AuthorizerOperation.QUERY) {
      outputString = JSON.stringify(queryOutput, null, 2)
    } else {
      outputString = JSON.stringify(output, null, 2)
    }
    editorRef.current?.setValue(outputString)
  }, [output, queryOutput, request])

  useEffect(() => setActiveQueryTab('Results'), [output])

  useEffect(() => {
    if (
      (!queryMetrics && activeQueryTab === 'Metrics') ||
      (!queryTrace && activeQueryTab === 'Trace') ||
      (!queryTraceSummary && activeQueryTab === 'Trace Summary')
    ) {
      setActiveQueryTab('Results')
    }
  }, [activeQueryTab, queryMetrics, queryTrace, queryTraceSummary])

  return (
    <>
      <ColumnWrapper>
        <Header>
          <Row $centered style={{ height: '100%' }}>
            <Row $centered $flex style={{ marginRight: 20 }}>
              <HeaderTitle>REQUEST:</HeaderTitle>
              <HeaderSelectContainer>
                <Select
                  isSearchable={false}
                  modifyCustomStyle={(style) => {
                    return {
                      ...style,
                      option: (
                        styles,
                        { data, isDisabled, isFocused, isSelected },
                      ) => {
                        return {
                          ...styles,
                          ':active': {
                            ...styles[':active'],
                            backgroundColor: theme.grey40,
                          },
                          backgroundColor: isDisabled
                            ? theme.grey20
                            : isFocused
                              ? theme.grey40
                              : isSelected
                                ? theme.grey20
                                : theme.grey20,
                          borderBottom:
                            data.value === 'CHECK'
                              ? `2px ${theme.grey30} solid`
                              : '',
                          borderLeft: isSelected
                            ? `5px solid ${theme.indogoAccent3}`
                            : `5px solid transparent`,
                          color: isFocused ? theme.grey100 : theme.grey70,
                          cursor: isDisabled ? 'not-allowed' : 'default',
                          fontSize: 14,
                          height: '100%',
                          lineHeight: '20px',
                          minHeight: 36,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }
                      },
                    }
                  }}
                  options={requestOptions}
                  value={requestOptions.find(({ value }) => value === request)}
                  onChange={(option) => {
                    if (option?.value !== request) {
                      onRequestChange?.()
                    }
                    if (option?.value) {
                      setRequest(option.value as AuthorizerOperation)
                      setRequestPath(
                        REQUEST_PATHS[option.value as AuthorizerOperation],
                      )
                    }
                  }}
                />
              </HeaderSelectContainer>
            </Row>
            <PlayButton
              disabled={!!policyContextError || !!resourceContextError}
              onSubmit={onSubmit}
            />
            <div style={{ flex: 1, marginLeft: 20 }}>
              <HeaderTitle>OUTPUT:</HeaderTitle>
            </div>
          </Row>
        </Header>
        <Container>
          <ContentContainer>
            <SideContent $left>
              {request === AuthorizerOperation.CHECK ? (
                <RebacEvaluator />
              ) : (
                <Row $centered>
                  <FieldContainer>
                    <Select
                      label="Identity Context"
                      options={identityOptions}
                      value={identityOptions.find(
                        ({ value }) => type === value,
                      )}
                      onChange={(option) => {
                        if (option?.value) {
                          if (
                            option.value === ApiIdentityType.IDENTITY_TYPE_NONE
                          ) {
                            setSubjectInstance(null)
                          }
                          setType(option.value as ApiIdentityType)
                          setIdentity(null)
                        }
                      }}
                    />
                  </FieldContainer>
                  {type === ApiIdentityType.IDENTITY_TYPE_SUB && (
                    <>
                      <SeparationDots>:</SeparationDots>
                      <FieldContainer $marginTop={32}>
                        <EvaluatorStyledInput
                          placeholder="Identity"
                          value={identity || ''}
                          onChange={(e) => setIdentity(e.target.value)}
                        />
                      </FieldContainer>
                    </>
                  )}

                  {(type === ApiIdentityType.IDENTITY_TYPE_MANUAL ||
                    type === ApiIdentityType.IDENTITY_TYPE_JWT) && (
                    <>
                      <SeparationDots>:</SeparationDots>
                      <FieldContainer $marginTop={32}>
                        <EvaluatorStyledInput
                          placeholder="Identity"
                          value={identity || ''}
                          onChange={(e) => setIdentity(e.target.value)}
                        />
                      </FieldContainer>
                    </>
                  )}
                </Row>
              )}

              {request === AuthorizerOperation.DECISIONTREE && (
                <PolicyDecisiontreeFields />
              )}
              {request === AuthorizerOperation.IS && !!policyModules && (
                <PolicyIsFields policyModules={policyModules} />
              )}
              {request === AuthorizerOperation.QUERY && <PolicyQueryFields />}
            </SideContent>
            <SideContent $right>
              <EvaluatorContainer>
                <Label>Request</Label>
                <CopyButton
                  disabled={!requestBody}
                  size="sm"
                  variant="secondary"
                  onClick={copyCurl}
                >
                  Copy as cURL
                </CopyButton>
              </EvaluatorContainer>
              <TextBox $height={262}>
                <Highlight language="json">
                  {JSON.stringify(requestBody, null, 2)}
                </Highlight>
              </TextBox>
              {(request === AuthorizerOperation.IS ||
                request === AuthorizerOperation.CHECK) &&
                output && (
                  <>
                    <ResultsLabel>Results</ResultsLabel>
                    <ResultsTextBox>
                      <HighlightedOutput>
                        <MonacoEditor
                          defaultLanguage="json"
                          defaultValue={JSON.stringify(output, null, 2)}
                          layoutOptions={{
                            automaticLayout: true,
                            fontSize: 14,
                            lineNumbers: 'off',
                            minimap: { autohide: true },
                            readOnly: true,
                            scrollBeyondLastLine: false,
                          }}
                          themeRules={MonacoTheme}
                          onMount={handleEditorDidMount}
                        />
                      </HighlightedOutput>
                    </ResultsTextBox>
                  </>
                )}
              {request === AuthorizerOperation.DECISIONTREE &&
                isDecisionTreeResponse(output) && (
                  <DecisionTreeTable data={output} />
                )}
              {request === AuthorizerOperation.QUERY && queryOutput && (
                <>
                  <TabGroup>
                    <Tab
                      $active={activeQueryTab === 'Results'}
                      onClick={() => setActiveQueryTab('Results')}
                    >
                      Results
                    </Tab>
                    {!!queryTrace && (
                      <Tab
                        $active={activeQueryTab === 'Trace'}
                        onClick={() => setActiveQueryTab('Trace')}
                      >
                        Trace
                      </Tab>
                    )}
                    {!!queryTraceSummary && (
                      <Tab
                        $active={activeQueryTab === 'Trace Summary'}
                        onClick={() => setActiveQueryTab('Trace Summary')}
                      >
                        Trace Summary
                      </Tab>
                    )}
                    {!!queryMetrics && (
                      <Tab
                        $active={activeQueryTab === 'Metrics'}
                        onClick={() => setActiveQueryTab('Metrics')}
                      >
                        Metrics
                      </Tab>
                    )}
                  </TabGroup>
                  <ResultsTextBox>
                    <HighlightedOutput>
                      <MonacoEditor
                        defaultLanguage="json"
                        defaultValue={JSON.stringify(queryOutput, null, 2)}
                        layoutOptions={{
                          automaticLayout: true,
                          fontSize: 14,
                          lineNumbers: 'off',
                          minimap: { autohide: true },
                          readOnly: true,
                          scrollBeyondLastLine: false,
                        }}
                        themeRules={MonacoTheme}
                        onMount={handleEditorDidMount}
                      />
                    </HighlightedOutput>
                  </ResultsTextBox>
                </>
              )}
            </SideContent>
          </ContentContainer>
        </Container>
      </ColumnWrapper>
    </>
  )
}

export default PolicyEvaluatorContent
