import { Link as ReactRouterLink } from "react-router";
import styled from "styled-components";

export const Link = styled(ReactRouterLink)`
  text-decoration: none;
`;

export const UndecoratedLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;
