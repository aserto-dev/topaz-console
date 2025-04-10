import { Navbar } from "react-bootstrap";
import styled from "styled-components";

import { theme } from "../../../theme";

export const NavBarContainer = styled.div<{
  $topPosition?: number;
  $expand?: number;
}>`
  position: fixed;
  width: 100%;
  z-index: 10;

  .navbar-toggler {
    font-size: 1.1rem;
    margin-right: 24px;

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }

  .navbar {
    background-color: ${theme.grey10};
    min-height: 80px;
    border-bottom: 1px solid ${theme.grey30};
    white-space: nowrap;
    padding: 0;

  }

  .dropdown-menu {
    top: 65px;
  }

  .nav-item {
    margin-top: 20px;
    height: 59px;
  }

  a.nav-link {
    height: 59px;
  }

  .navbar-nav .nav-link {
    margin: 0 40px 0 0;
    text-decoration: none;
  }

  .navbar-nav .nav-link:hover {
    color: ${theme.grey100};
  }

  .navbar .active {
    border-bottom: 1px solid ${theme.lochivarAccent4};
    color: ${theme.grey100} !important;
  }


  .navbar-brand {
    margin-left: 24px;
  }

  @media (min-width: 1200px) and (max-width: 1260px) {
      .navbar-brand  {
      margin-left: 10px;
    }
  }

  @media (max-width: ${({ $expand }) => $expand}px) {
    .navbar {
      padding: 10px;
      display: flex;
      align-items: center;
    }

    .navbar-text {
      flex: 1;
    }

    .nav-item {
      margin-top: 0px;
      height: 50px;
    }

    .nav-item .nav-link::before {
      content: '';
      display: inline-block;
      background:  rgb(30, 30, 30);
      width: 4px;
      height: 40px;
      margin-bottom: -12px;
      margin-right: 12px;
      border-radius: 140px;
      border:none;
    }

    .nav-item .nav-link.active::before {
      background: ${theme.lochivarAccent3};
    }

      .nav-item .nav-link.active {
        border-bottom: 0;
     }

      .navbar-nav:first-child {
        margin-top: 1.5em;
      }
    }
  }

`;

export const NavBarBrand = Navbar.Brand;

export const Separator = styled.img<{ $hideBreakpoint?: number }>`
  margin-right: 30px;
  @media (max-width: ${({ $hideBreakpoint }) => $hideBreakpoint}px) {
    display: none;
  }
`;
