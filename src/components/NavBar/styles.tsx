import { Dropdown } from "react-bootstrap";
import styled from "styled-components";

import { theme } from "../../theme";

export const SelectInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  max-width: 260px;
  @media (min-width: 1200px) {
    width: 260px;
    img {
      margin: auto 10px auto 30px;
    }
  }
  @media (max-width: 1200px) {
    img {
      display: none;
    }
  }
`;

export const StyledDropdown = styled(Dropdown)`
  .toggle-profile {
    margin: auto 20px !important;
  }
  @media (max-width: 1260px) {
    margin-left: -40px;
  }
`;

export const DropdownMenu = styled(Dropdown.Menu)`
  border-radius: 5px;
  margin: 5px !important;
  background-color: ${theme.grey10};
  color: ${theme.grey70};
  .dropdown-header {
    color: ${theme.grey100};
    font-weight: bold;
    margin-left: 5px;
    margin-right: 7px;
  }
  .dropdown-item {
    color: ${theme.grey70};
    text-decoration: none;
  }

  .dropdown-item:hover,
  :focus {
    background-color: ${theme.grey30};
    color: ${theme.grey100};
  }
`;
