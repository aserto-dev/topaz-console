import { Nav } from "react-bootstrap";

import TopazLogo from "../../assets/topaz.svg";
import AsertoNavBar, { AsertoNavLink } from "../common/AsertoNavBar";

export const NavBar = () => {
  return (
    <>
      <AsertoNavBar
        expand="xl"
        logo={
          <a href={"/ui/directory/model"}>
            <img height={48} alt="aserto" src={TopazLogo} />
          </a>
        }
      >
        <Nav as="ul" className="mr-auto">
          <>
            <Nav.Item as="li">
              <AsertoNavLink
                end="modules"
                title="Authorizer"
                to="/ui/authorizer/modules"
              ></AsertoNavLink>
            </Nav.Item>

            <>
              <Nav.Item as="li">
                <AsertoNavLink
                  end="model"
                  title="Directory"
                  to="/ui/directory/model"
                ></AsertoNavLink>
              </Nav.Item>
            </>
          </>
        </Nav>
      </AsertoNavBar>
    </>
  );
};
