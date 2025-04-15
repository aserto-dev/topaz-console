import styled, { css } from 'styled-components'
import { theme } from '../../../../theme'

export const Column = styled.div<{ $flex?: boolean }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  ${({ $flex }) => ($flex ? 'flex: 1' : '')};
  @media (max-width: 1028px) {
    margin-bottom: 30px;
    flex: 1;
    margin-right: auto;
    flex-direction: column;
  }
`

export const Content = styled.div<{
  $flex?: boolean
  $fixed?: boolean
  $paddingTop?: number
  $shouldPad?: boolean
  $hasBorderLeft?: boolean
}>`
  color: ${theme.grey100};
  ${({ $flex }) => ($flex ? 'flex: 1' : '')};
  font-size: 18px;
  margin-top: 20px;
  font-weight: bold;
  @media (min-width: 1028px) {
    min-height: 160px;
    max-height: calc(100vh - 18.6rem);
    padding: 0 10px;
    ${({ $hasBorderLeft }) =>
      $hasBorderLeft
        ? `border-left: 1px solid ${theme.grey20}; padding: 0 20px;`
        : ''}
    ${({ $fixed }) => {
      return $fixed
        ? css`
            position: fixed;
            margin-top: -2px;
            width: 50%;
            background-color: ${theme.primaryBlack};
            display: flex;
          `
        : ''
    }}
  }

  @media (max-width: 1028px) {
    min-height: 130px;
    pre {
      padding: 0 20px;
    }
    ${({ $fixed, $shouldPad }) => {
      return $fixed
        ? css`
            position: fixed;
            top: ${$shouldPad ? 169 : 0}px;
            width: 100%;
            z-index: 2;
            background-color: #121212;
          `
        : css``
    }}
  }

  @media (max-width: 600px) {
    font-size: 14px;
  }
`

export const PillLineItem = styled.div<{ $isSmall?: boolean }>`
  margin-bottom: 10px;
  border-radius: 5px;
  width: 100%;
  display: flex;
  text-align: start;
  font-weight: 600;
  a {
    min-width: 318px;
    padding: ${({ $isSmall }) => ($isSmall ? '9px 20' : 20)}px;
    background-color: ${theme.grey20};
    color: ${theme.grey20};
    &:hover {
      background-color: ${theme.grey40};
      color: ${theme.grey100};
      text-decoration: none;
    }
    font-size: 14px;
  }
`

export const ContentHeader = styled.div<{
  height?: number
}>`
  border-bottom: 2px solid ${theme.grey40};
  background-color: ${theme.primaryBlack};
  color: ${theme.grey100};
  font-weight: bold;
  font-size: 14px;
  padding: 20px 0px;
  display: flex;
  align-items: center;
  ${({ height }) => (height ? `height: ${height}px` : '')};
`
