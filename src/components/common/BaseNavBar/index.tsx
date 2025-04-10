import React, { useMemo } from 'react'
import { Navbar } from 'react-bootstrap'
import { NavLink, useMatch, useResolvedPath } from 'react-router'

import Logo from '../../../assets/topaz-logo.svg'
import separator from '../../../assets/separator.svg'
import { NavBarBrand, NavBarContainer, Separator } from './styles'

type expandSteps = 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export type BaseNavBarProps = {
  children?: React.ReactNode
  logo?: React.ReactNode
  uncollapsableContent?: React.ReactNode
  showBrandSeparator?: boolean
  topPosition?: number
  expand?: expandSteps
  testId?: string
}
const styleBreakpointsMap: Record<expandSteps, number | undefined> = {
  sm: 575,
  md: 767,
  lg: 991,
  xl: 1199,
  xxl: 1399,
}
const DEFAULT_LOGO = <img alt="logo" src={Logo} />
const DEFAULT_EXPAND = 'xl'

interface BaseNavLinkProps {
  to: string
  title: string
  end?: string
}

export const BaseNavLink = React.memo(
  ({ to, title, end }: BaseNavLinkProps) => {
    const resolved = useResolvedPath(to)
    const pathname = useMemo(
      () => (end ? resolved.pathname.replace(end, '') : resolved.pathname),
      [resolved, end],
    )
    const match = useMatch({ path: pathname, end: false })

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
