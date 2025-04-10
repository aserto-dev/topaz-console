import styled from "styled-components";
import Button from "../../components/common/Button";
import { theme } from "../../theme";

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
  @media (min-width: 913px) {
    grid-area: sidebar;
  }
`;

export const Content = styled.div`
  grid-area: content;
  display: flex;
  width: 100%;
  @media (max-width: 912px) {
    display: inline;
    padding: 25px;
  }
`;

export const ObjectHeaderContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.primaryBlack};
  color: ${theme.grey100};
  z-index: 1;
  position: -webkit-sticky;
  position: sticky;
  top: 181px;
  @media (max-width: 912px) {
    top: 170px;
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
    svg {
      fill: ${theme.grey100};
    }
  }
  svg {
    fill: ${theme.grey70};
    height: 20px;
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
export const EmptyTextContainerWithoutPadding = styled.div`
  padding-left: 25px;
`;
export const SaveButtonContainer = styled.div<{ $show?: boolean }>`
  ${({ $show }) => {
    return $show ? "display: block" : "visibility: hidden";
  }};
  display: flex;
  gap: 5px;
`;
