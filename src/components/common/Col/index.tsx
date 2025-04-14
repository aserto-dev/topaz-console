import styled from 'styled-components'

export const Col = styled.div<{ $gap?: number; $flex?: number }>`
  display: flex;
  flex-direction: column;
  ${({ $gap }) => ($gap ? `gap: ${$gap}px` : '')}
  ${({ $flex }) => ($flex ? `flex: ${$flex}` : '')}
`
