import { Nav } from 'react-bootstrap'

import TopazLogo from '../../assets/topaz.svg'
import BaseNavBar, { BaseNavLink } from '../common/BaseNavBar'

export const NavBar = () => {
  return (
    <>
      <BaseNavBar
        expand="xl"
        logo={
          <a href="/ui/directory/model">
            <img alt="topaz" height={48} src={TopazLogo} />
          </a>
        }
      >
        <Nav as="ul" className="mr-auto">
          <>
            <Nav.Item as="li">
              <BaseNavLink
                end="modules"
                title="Authorizer"
                to="/ui/authorizer/modules"
              ></BaseNavLink>
            </Nav.Item>

            <>
              <Nav.Item as="li">
                <BaseNavLink
                  end="model"
                  title="Directory"
                  to="/ui/directory/model"
                ></BaseNavLink>
              </Nav.Item>
            </>
          </>
        </Nav>
      </BaseNavBar>
    </>
  )
}
