import styled from 'styled-components'

export const Col = styled.div<{ $flex?: number; $gap?: number; }>`
  display: flex;
  flex-direction: column;
  ${({ $gap }) => ($gap ? `gap: ${$gap}px` : '')}
  ${({ $flex }) => ($flex ? `flex: ${$flex}` : '')}
`
