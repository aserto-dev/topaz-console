import React, { useMemo } from 'react'
import { Navbar } from 'react-bootstrap'
import { NavLink, useMatch, useResolvedPath } from 'react-router'

import separator from '../../../assets/separator.svg'
import Logo from '../../../assets/topaz-logo.svg'
import { NavBarBrand, NavBarContainer, Separator } from './styles'

type BaseNavBarProps = {
  children?: React.ReactNode
  expand?: expandSteps
  logo?: React.ReactNode
  showBrandSeparator?: boolean
  testId?: string
  topPosition?: number
  uncollapsableContent?: React.ReactNode
}

type expandSteps = 'lg' | 'md' | 'sm' | 'xl' | 'xxl'
const styleBreakpointsMap: Record<expandSteps, number | undefined> = {
  lg: 991,
  md: 767,
  sm: 575,
  xl: 1199,
  xxl: 1399,
}
const DEFAULT_LOGO = <img alt="logo" src={Logo} />
const DEFAULT_EXPAND = 'xl'

interface BaseNavLinkProps {
  end?: string
  title: string
  to: string
}

export const BaseNavLink = React.memo(
  ({ end, title, to }: BaseNavLinkProps) => {
    const resolved = useResolvedPath(to)
    const pathname = useMemo(
      () => (end ? resolved.pathname.replace(end, '') : resolved.pathname),
      [resolved, end],
    )
    const match = useMatch({ end: false, path: pathname })

    return (
      <NavLink
        aria-current={match ? 'page' : undefined}
        className={match ? 'nav-link active' : 'nav-link'}
        to={to}
      >
        {title}
      </NavLink>
    )
  },
)

const BaseNavBar: React.FC<BaseNavBarProps> = ({
  children,
  expand,
  logo = DEFAULT_LOGO,
  showBrandSeparator,
  topPosition,
  uncollapsableContent,
  ...props
}) => {
  return (
    <NavBarContainer
      $expand={styleBreakpointsMap[expand ?? DEFAULT_EXPAND]}
      $topPosition={topPosition}
      {...props}
    >
      <Navbar
        className="navbar-dark"
        collapseOnSelect
        expand={expand ?? DEFAULT_EXPAND}
      >
        <NavBarBrand>{logo}</NavBarBrand>
        {uncollapsableContent && (
          <Navbar.Text>{uncollapsableContent}</Navbar.Text>
        )}
        {showBrandSeparator && (
          <Separator
            $hideBreakpoint={styleBreakpointsMap[expand ?? DEFAULT_EXPAND]}
            src={separator}
          />
        )}
        {children && (
          <>
            <Navbar.Toggle />
            <Navbar.Collapse>{children}</Navbar.Collapse>
          </>
        )}
      </Navbar>
    </NavBarContainer>
  )
}

export default BaseNavBar
