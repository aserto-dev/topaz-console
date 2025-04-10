import styled from 'styled-components'

export const Row = styled.div<{
  $centered?: boolean
  $marginTop?: number
  $flex?: boolean
  $marginLeft?: number
}>`
  display: flex;
  flex-direction: row;
  ${({ $centered }) => ($centered ? 'align-items: center' : '')};
  ${({ $marginTop }) => ($marginTop ? `margin-top: ${$marginTop}px` : '')};
  ${({ $marginLeft }) => ($marginLeft ? `margin-left: ${$marginLeft}px` : '')};
  ${({ $flex }) => ($flex ? `flex: 1` : '')};
`
