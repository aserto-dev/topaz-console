import { NavLink } from 'react-router'
import styled from 'styled-components'
import { theme } from '../../../../../theme'

export const NavTab = styled(NavLink)`
  margin-left: 20px;
  margin-top: 20px;
  padding-bottom: 10px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  @media (max-width: 684px) {
    .tab-name {
      display: none;
    }
    margin-left: 40px;
  }

  color: ${theme.grey70};
  &:hover,
  &.active {
    text-decoration: none;
    color: ${theme.grey100};
    img {
      filter: brightness(150%);
    }
  }
  &.active {
    border-bottom: 1px solid ${theme.indogoAccent4};
  }
  img {
    margin: 0 8px 2px 0;
  }
`

export const TabGroup = styled.div`
  width: 100%;
  display: inline-flex;
  border-bottom: 1px solid ${theme.grey30};
  text-decoration: none;
`
