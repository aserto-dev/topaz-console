import styled from "styled-components";

import { theme } from "../../theme.ts";
import Button from "../common/Button/index.tsx";

export const Grid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0 50px 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "header"
    "sidebar"
    "content";

  @media (min-width: 913px) {
    display: grid;
    grid-template-columns: 250px 1.3fr 1fr;
    grid-template-rows: 0 1.7fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
      "header header header"
      "sidebar content content"
      "sidebar content content";
  }
`;

export const Sidebar = styled.div`
  position: fixed;
  width: 100%;
  background-color: ${theme.primaryBlack};
  z-index: 2;
  @media (min-width: 913px) {
    grid-area: sidebar;
  }
`;

export const Content = styled.div`
  grid-area: content;
  display: flex;
  width: 100%;
`;

export const ObjectHeaderContainer = styled.div`
  padding: 12px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.primaryBlack};
  color: ${theme.grey100};
  z-index: 1;
  position: -webkit-sticky;
  position: sticky;
  top: 140px;
  @media (max-width: 912px) {
    position: fixed;
    top: 184px;
    width: 100%;
    border-bottom: 1px solid ${theme.grey20};
    margin: 20px 0;
  }
`;

export const HeaderButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const ImageButton = styled.div`
  display: flex;
  align-items: center;
  padding: 2px;
  background-color: inherit;
  white-space: nowrap;
  gap: 10px;
  color: ${theme.grey70};
  &:focus,
  &:hover:not(:disabled) {
    color: ${theme.grey100};
    cursor: pointer;
    img {
      filter: brightness(150%);
    }
  }
  span {
    font-weight: 400;
  }
`;

export const AddButton = styled(Button)`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 5px;
`;
