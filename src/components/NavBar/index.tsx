import { Nav } from 'react-bootstrap'

import TopazLogo from '../../assets/topaz.svg'
import { useConfig } from '../../services/ConfigProvider/hooks'
import BaseNavBar, { BaseNavLink } from '../common/BaseNavBar'

export const NavBar = () => {
  const { authenticationType } = useConfig()

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
        {authenticationType?.toLowerCase() === 'apikey' && (
          <Nav className="ms-auto d-grid gap-2">
            <Nav.Item as="li">
              <Nav.Link
                onClick={() => {
                  localStorage.removeItem('apiKey')
                  window.location.href = '/'
                }}
              >
                Sign out
              </Nav.Link>
            </Nav.Item>
          </Nav>
        )}
      </BaseNavBar>
    </>
  )
}
