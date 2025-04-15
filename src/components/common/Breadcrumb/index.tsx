import React from 'react'
import styled from 'styled-components'

import { theme } from '../../../theme'
import { Link } from '../UndecoratedLink'

type BreadCrumbPart = {
  text: string
  url?: string
}

type BreadcrumbProps = {
  breadcrumbParts?: BreadCrumbPart[]
  testId?: string
  title?: string
  usePathAsBreadcrumb?: boolean
  variant?: Variant
}

type Variant = 'large' | 'small'

const BreadcrumbContainer = styled.div<{ $variant: Variant }>`
  width: 100%;
  font-size: ${({ $variant }) => ($variant === 'large' ? `24px` : `16px`)};
  color: ${theme.grey100};
`

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  breadcrumbParts,
  title,
  usePathAsBreadcrumb,
  variant = 'large',
}) => {
  // if the flag was passed as true, construct the breadcrumb from the path
  if (usePathAsBreadcrumb) {
    const path = window.location.pathname
    const components = path.split('/')
    if (components.length > 1) {
      const tabName = components[1]
      const capitalizedTabName =
        tabName.charAt(0).toUpperCase() + tabName.slice(1)
      const breadcrumb = <Link to={`/${tabName}`}>{capitalizedTabName}</Link>

      return (
        <BreadcrumbContainer $variant={variant}>
          {breadcrumb} / {title}
        </BreadcrumbContainer>
      )
    }

    // no path to construct breadcrumb from, so return just the title
    return <BreadcrumbContainer $variant={variant}>{title}</BreadcrumbContainer>
  }

  // if multiple breadcrumb parts were passed in, construct the breadcrumb from them
  if (breadcrumbParts) {
    return (
      <BreadcrumbContainer $variant={variant}>
        {breadcrumbParts.map((part, index) => {
          return part.url ? (
            <span key={index}>
              {index > 0 && ' / '}
              <Link to={`${part.url}`}>{part.text}</Link>
            </span>
          ) : (
            <span key={index}>
              {index > 0 && ' / '}
              {part.text}
            </span>
          )
        })}
      </BreadcrumbContainer>
    )
  }
  // as a last resort, just use the title
  return <BreadcrumbContainer $variant={variant}>{title}</BreadcrumbContainer>
}

export default Breadcrumb
