import styled, { css } from 'styled-components'

import Button from '../../../../components/common/Button'
import { theme } from '../../../../theme'
import Label from '../../../../components/common/Label'

export const NavContainer = styled.div`
  background-color: ${theme.grey10};
  margin-top: 4px;
  padding: 12px 0px;
  width: 100%;
`
export const NavTab = styled.span<{ $active?: boolean; $disabled?: boolean }>`
  margin-left: 24px;
  padding: 12px 6px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  font-weight: 400;
  font-size: 14px;
  &:hover {
    color: ${theme.grey100};
  }
  ${({ $disabled }) => !!$disabled && `pointer-events: none;`}

  ${({ $active }) => {
    if ($active) {
      return css`
        border-bottom: 1px solid ${theme.indogoAccent4};
        color: ${theme.grey100};
      `
    }
  }}
`

export const Container = styled.div`
  width: 100%;
  display: inline-flex;
  margin-top: 75px;
  @media (max-width: 1198px) {
    margin-top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  @media (max-width: 912px) {
    margin-top: 20px;
  }
`

export const Header = styled.div`
  background-color: ${theme.grey20};
  padding: 20px;
  height: 80px;
  width: 100%;
  @media (min-width: 1199px) {
    position: fixed;
    top: 0px;
    width: calc(100% - 250px);
    z-index: 9;
    transform: translateY(175%);
  }
`
export const PlayButtonHeader = styled.div`
  padding: 20px;
  position: fixed;
  top: 0;
  left: calc(50% + 75px);
  height: 80px;
  z-index: 10;
  transform: translateY(175%);
  @media (max-width: 1198px) {
    display: none;
  }
`

export const SmallScreenPlayDiv = styled.div`
  @media (min-width: 1199px) {
    display: none;
  }
`

export const HeaderSelectContainer = styled.div`
  flex: 1;
  max-width: 300px;
  margin-left: 10px;
`

export const HeaderTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.grey100};
`
export const EvaluatorContainer = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-between;
`

export const ResultsContainer = styled.div`
  display: flex;
  height: 40px;
  justify-content: space-between;
`
export const ButtonsContainer = styled.div`
  display: flex;
  margin-right: -8px;
  margin-top: 17px;
`

export const ResultButtonsContainer = styled.div`
  display: flex;
  margin-right: -8px;
  margin-top: 8px;
  align-items: center;
`

export const ObjectDiv = styled.div`
  display: inline-flex;
  gap: 15px;
  > div {
    width: 100%;
  }
`

export const SubContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  @media (min-width: 1199px) {
    border-bottom: 1px solid ${theme.grey10};
    border-left: 1px solid ${theme.grey10};
    height: calc(100vh - 13.6rem);
    overflow-y: auto;
  }
  @media (max-width: 1198px) {
    width: 100%;
  }
  @media (max-width: 912px) {
    border: 1px solid ${theme.grey10};
    border-radius: 4px;
    padding-bottom: 20px;
  }
`

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 30px 0;
  padding: 0 30px;
`

export const RightContainer = styled.div`
  padding: 0 30px 30px;
`

export const TextBox = styled.div<{
  $margin?: number | string
  $height?: number
}>`
  background-color: ${theme.primaryBlack};
  border: 1px solid ${theme.grey40};
  border-radius: 4px;
  margin-top: ${({ $margin }) => $margin}px;
  height: ${({ $height }) => $height || 245}px;
  overflow-y: auto;
`

export const CopyButton = styled(Button)`
  margin: 10px 10px 40px 0;
  height: 22px;
  line-height: 50%;
`

export const EvaluatorLabel = styled(Label)`
  margin-top: 28px;
`
