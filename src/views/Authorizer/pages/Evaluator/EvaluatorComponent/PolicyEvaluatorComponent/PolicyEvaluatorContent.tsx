import { editor } from 'monaco-editor'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Monaco } from '@monaco-editor/react'
import Highlight from '../../../../../../components/common/Highlight'

import { PolicyEvaluatorProps } from '.'
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
import Select, {
  SelectOption,
} from '../../../../../../components/common/Select'
import {
  ApiIdentityType,
  V2DecisionTreeResponse,
  V2IsResponse,
  V2QueryResponse,
} from '../../../../../../types/authorizer'

import { Row } from '../../../../../../components/common/Row'
import { theme } from '../../../../../../theme'
import { PlayButton } from '../../../../../../components/common/PlayButton'
import Label from '../../../../../../components/common/Label'
import { TextBox } from '../../../../../Directory/pages/Evaluator/styles'
import MonacoEditor from '../../../../../../components/common/MonacoEditor'
import {
  useContentPolicyEvaluatorContext,
  usePolicyEvaluatorErrorContext,
  useRebacPolicyEvaluatorContext,
  AuthorizerOperation,
} from '../../../../../../services/PolicyEvaluatorContextProvider/hooks'

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
  IS: 'api/V2/authz/is',
  DECISIONTREE: 'api/V2/authz/decisiontree',
  QUERY: 'api/V2/authz/query',
}

const MonacoTheme = [
  { token: 'constant', foreground: '#A8FF60' },
  { token: 'number', foreground: '#FF66FF' },
  { token: 'number.hex', foreground: '#FF66FF' },
  { token: 'annotation', foreground: '#96CBFE' },
  { token: 'type', foreground: '#96CBFE' },
  { token: 'delimiter', foreground: '#CCCCCC' },
  { token: 'delimiter.html', foreground: '#CCCCCC' },
  { token: 'delimiter.xml', foreground: '#CCCCCC' },
  { token: 'editorBracketHighlight', foreground: '#CCCCCC' },
  { token: 'metatag.content.html', foreground: '#A8FF60' },
  { token: 'key', foreground: '#96CBFE' },
  { token: 'string.key.json', foreground: '#96CBFE' },
  { token: 'string.value.json', foreground: '#A8FF60' },
  { token: 'attribute.value.unit', foreground: '#A8FF60' },
  { token: 'attribute.value.html', foreground: '#A8FF60' },
  { token: 'attribute.value.xml', foreground: '#A8FF60' },
  { token: 'string', foreground: '#A8FF60' },
  { token: 'string.html', foreground: '#A8FF60' },
  { token: 'string.sql', foreground: '#A8FF60' },
  { token: 'string.yaml', foreground: '#A8FF60' },
  { token: 'keyword', foreground: '#99CC99' },
  { token: 'keyword.json', foreground: '#99CC99' },
  { token: 'keyword.flow', foreground: '#99CC99' },
  { token: 'keyword.flow.scss', foreground: '#99CC99' },
]

function isDecisionTreeResponse(
  output:
    | V2QueryResponse
    | V2IsResponse
    | V2DecisionTreeResponse
    | string
    | undefined,
): output is V2DecisionTreeResponse {
  return (output as V2DecisionTreeResponse)?.path !== undefined
}

export const PolicyEvaluatorContent: React.FC<PolicyEvaluatorProps> = ({
  output,
  onSubmit,
  onRequestChange,
  policyModules,
  isRebac,
  requestBody,
}) => {
  const [requestPath, setRequestPath] = useState<string>('')
  const { copyCurl } = useCopyCurl(
    JSON.stringify(requestBody),
    requestPath || REQUEST_PATHS['IS'],
  )
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const {
    request,
    setRequest,
    identity,
    setIdentity,
    type,
    setType,
    queryMetrics,
    queryTrace,
    queryTraceSummary,
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
              value: 'CHECK',
            },
            {
              label: 'Is',
              value: 'IS',
            },
            {
              label: 'decisiontree',
              value: 'DECISIONTREE',
            },
            {
              label: 'query',
              value: 'QUERY',
            },
          ]
        : [
            {
              label: 'Is',
              value: 'IS',
            },
            {
              label: 'decisiontree',
              value: 'DECISIONTREE',
            },
            {
              label: 'query',
              value: 'QUERY',
            },
          ],
    [isRebac],
  )

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    monaco.editor.setTheme('aserto')
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
    'Results' | 'Trace' | 'Metrics' | 'Trace Summary'
  >('Results')

  const queryResult = (output as V2QueryResponse)?.response
  const queryMetricsOutput = (output as V2QueryResponse)?.metrics
  const queryTraceOutput = (output as V2QueryResponse)?.trace
  const queryTraceSummaryOutput = (output as V2QueryResponse)?.trace_summary

  const queryOutput = useMemo(() => {
    if (request === 'QUERY') {
      switch (activeQueryTab) {
        case 'Results':
          return queryResult
        case 'Trace':
          return queryTraceOutput
        case 'Metrics':
          return queryMetricsOutput
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
    if (request === 'QUERY') {
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
                        { isDisabled, isFocused, isSelected, data },
                      ) => {
                        return {
                          ...styles,
                          borderBottom:
                            data.value === 'CHECK'
                              ? `2px ${theme.grey30} solid`
                              : '',
                          backgroundColor: isDisabled
                            ? theme.grey20
                            : isFocused
                              ? theme.grey40
                              : isSelected
                                ? theme.grey20
                                : theme.grey20,
                          borderLeft: isSelected
                            ? `5px solid ${theme.indogoAccent3}`
                            : `5px solid transparent`,
                          color: isFocused ? theme.grey100 : theme.grey70,
                          height: '100%',
                          minHeight: 36,
                          fontSize: 14,
                          lineHeight: '20px',
                          cursor: isDisabled ? 'not-allowed' : 'default',
                          ':active': {
                            ...styles[':active'],
                            backgroundColor: theme.grey40,
                          },
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
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
              {request === 'CHECK' ? (
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
                          if (option.value === 'IDENTITY_TYPE_NONE') {
                            setSubjectInstance(null)
                          }
                          setType(option?.value as ApiIdentityType)
                          setIdentity(null)
                        }
                      }}
                    />
                  </FieldContainer>
                  {type === 'IDENTITY_TYPE_SUB' && (
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

                  {(type === 'IDENTITY_TYPE_MANUAL' ||
                    type === 'IDENTITY_TYPE_JWT') && (
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

              {request === 'DECISIONTREE' && <PolicyDecisiontreeFields />}
              {request === 'IS' && !!policyModules && (
                <PolicyIsFields policyModules={policyModules} />
              )}
              {request === 'QUERY' && <PolicyQueryFields />}
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
              {(request === 'IS' || request === 'CHECK') && output && (
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
              {request === 'DECISIONTREE' && isDecisionTreeResponse(output) && (
                <DecisionTreeTable data={output} />
              )}
              {request === 'QUERY' && queryOutput && (
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
