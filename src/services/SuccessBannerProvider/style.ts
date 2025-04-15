import styled from 'styled-components'

import { theme } from '../../theme'

export const SuccessContent = styled.div<{ $show?: boolean }>`
  height: 31px;
  width: 304px;
  display: flex;
  top: 0;
  transition: top 0.75s ease-out;
  ${({ $show }) => ($show ? 'top: 0' : 'top: -31px')};
  align-items: center;
  justify-content: center;
  margin: auto;
  position: fixed;
  // 50% of the viewport minus half of the size of the element
  left: calc(50% - 152px);
  font-weight: bold;
  font-size: 14px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  z-index: 11;
  color: ${theme.grey100};
  background-color: ${theme.apple50};
  @media (max-width: 720px) {
    width: 100%;
    height: 16px;
    font-size: 12px;
    left: 0;
  }
  img {
    cursor: pointer;
    width: 11px;
    height: 11px;
    right: 10px;
    position: absolute;
  }
`
