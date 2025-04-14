import styled, { css } from 'styled-components'
import Input from '../../../../../../components/common/Input'
import { theme } from '../../../../../../theme'
import { Row } from '../../../../../../components/common/Row'
import { Col } from '../../../../../../components/common/Col'
import Button from '../../../../../../components/common/Button'
import Label from '../../../../../../components/common/Label'
import { TextBox } from '../../../../../Directory/pages/Evaluator/styles'
import TextArea from '../../../../../../components/common/TextArea'

export const Container = styled.div`
  position: relative;
  font-family: 'Roboto';
  min-width: 620px;
  width: 100%;
`

export const Header = styled.div`
  background-color: #2a2a2a;
  padding: 12px;
  width: 100%;
  @media (min-width: 1328px) {
    padding: 20px;
    height: 82px;
    z-index: 9;
  }
`

export const ContentContainer = styled.div`
  display: flex;
  width: auto;
  margin: 0 auto;
`

export const HeaderSelectContainer = styled.div`
  flex: 1;
  max-width: 300px;
  margin-left: 10px;
`
export const InputTopMargin = styled.div`
  margin-top: 10px;
`
export const EvaluatorStyledInput = styled(Input)`
  height: 36px;
`

export const HeaderTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.grey100};
`

export const SideContent = styled.div<{
  $left?: boolean
  $right?: boolean
  $overflow?: string
}>`
  height: calc(100vh - 14rem);
  @media (max-width: 1328px) {
    height: calc(100vh - 19.4rem);
  }
  position: relative;
  overflow: ${({ $overflow }) => $overflow || 'auto'};
  overflow-x: hidden;
  flex: 1;
  max-width: 50%;
  padding: 20px;
  ${({ $left, $right }) => {
    if ($left) {
      return css`
        border-right: 1px solid ${theme.grey20};
      `
    } else if ($right) {
      return css`
        margin-right: 15px;
      `
    }
  }}
`

export const Curve = styled.div`
  border-width: 0px;
  width: 13px;
  height: 22px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-style: solid;
  border-color: #414141;
  border-bottom-left-radius: 6px;
  background-color: #121212;
  background-size: cover;
  margin-bottom: -10px;
`

export const FieldContainer = styled.div<{
  $marginTop?: number
  $marginLeft?: number
  $marginBottom?: number
}>`
  flex: 1;
  margin-top: ${({ $marginTop }) => `${$marginTop}px`};
  margin-left: ${({ $marginLeft }) => `${$marginLeft}px`};
  margin-bottom: ${({ $marginBottom = 20 }) => `${$marginBottom}px`};
`

export const SeparationDots = styled.div`
  font-size: 30px;
  margin: 5px 5px 0;
`

export const QueryOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  label {
    font-size: 16px;
  }
  > div {
    height: 40px;
  }
`

export const SelectTraceContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
`

export const IsDecisionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`

export const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const IsDecisionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: 14px;
  margin-top: 17px;
  font-family:
    SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  font-weight: 600;
`

export const DecisionLabel = styled.div`
  flex: 1;
`

export const DecisionValue = styled.div<{ $allowed?: boolean }>`
  flex: 5;
`

export const Triangle = styled.div<{ $disabled?: boolean }>`
  width: 0;
  height: 0;
  border-width: 0 7.5px 10px 7.5px;
  border-style: solid;
  transform: rotate(90deg);
  ${({ $disabled }) => {
    if ($disabled) {
      return css`
        border-color: transparent transparent #c3c3c3 transparent;
      `
    } else {
      return css`
        border-color: transparent transparent #ffffff transparent;
      `
    }
  }}
`

export const Tick = styled.img`
  height: 14px;
  width: 18px;
  padding: 0 5px 0 0;
`

export const CondensedEvaluatorHeader = styled(Row)`
  border-bottom: 1px solid #000000;
`

export const InstructionText = styled.div`
  font-size: 14px;
  padding-top: 14px;
`

export const CondensedEvaluatorForm = styled.div`
  font-size: 14px;
  line-height: 1.5rem;
  font-family:
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    Liberation Mono,
    'Courier New',
    'monospace';
  > textarea {
    font-weight: 400;
    font-size: 14px;
    font-family:
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      Liberation Mono,
      'Courier New',
      'monospace';
  }
`

export const CondensedEvaluatorBody = styled(Row)`
  padding: 10px 10px 5px 10px;
  background-color: #2a2a2a;
  width: 98%;
  margin-top: 10px;
  margin-bottom: 5px;
`

export const CondensedEvaluatorLeftColumn = styled(Col)`
  flex: 2;
  padding-left: 10px;
  padding-right: 10px;
`
export const CondensedEvaluatorRightColumn = styled(Col)`
  flex: 2;
  margin-left: 15px;
`

export const CopyButton = styled(Button)`
  height: 24px;
  line-height: 50%;
  &:active {
    box-shadow: 0 5px ${theme.grey20};
    transform: translateY(4px);
  }
`

export const ResultsLabel = styled(Label)`
  margin-top: 28px;
`

export const EvaluatorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 32px;
`

export const TabGroup = styled.div`
  width: 100%;
  display: inline-flex;
  border-bottom: 1px solid ${theme.grey30};
  margin-bottom: 8px;
`

export const Tab = styled(Label)<{ $active?: boolean }>`
  margin-left: 20px;
  margin-top: 28px;
  margin-bottom: 0;
  padding-bottom: 12px;
  cursor: pointer;
  white-space: nowrap;
  ${({ $active }) => {
    return css`
      color: ${theme.grey70};
      &:hover {
        color: ${theme.grey100};
      }
      ${$active &&
      `color: ${theme.grey100};
        border-bottom: 1px solid ${theme.indogoAccent4};
        `}
    `
  }}
`

export const ResultsTextBox = styled(TextBox)`
  min-height: 252px;
  height: calc(100vh - 640px);
`

export const ResourceTextArea = styled(TextArea)<{ $hasError?: boolean }>`
  border-color: ${({ $hasError }) =>
    $hasError ? theme.mojoAccent3 : theme.grey40} !important;
  min-height: 252px;
  height: calc(100vh - 640px);
`

export const HighlightedOutput = styled.div`
  height: 100%;
  .monaco-editor {
    position: absolute !important;
  }
`

export const SectionTitleContainer = styled.div`
  margin-bottom: 12px;
`
