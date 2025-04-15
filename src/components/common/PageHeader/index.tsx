import React, { useCallback } from 'react'
import styled from 'styled-components'

import { useIsFetching, useQueryClient } from '@tanstack/react-query'

import { theme } from '../../../theme'
import PageTitle from '../PageTitle'
import RefreshButton from '../RefreshButton'

type PageHeaderProps = {
  children?: React.ReactNode
  hasBorderBottom?: boolean
  id?: string
  load?: () => void
  loading?: boolean
  mobileBreakpoint?: number
  subtitle?: React.ReactNode | string
  testId?: string
  title?: string
}

const PageHeaderContainer = styled.div<{
  $hasBorderBottom?: boolean
  $mobileBreakpoint?: number
}>`
  padding: 20px;
  position: fixed;
  width: 100%;
  top: 80px;
  ${({ $hasBorderBottom }) =>
    $hasBorderBottom ? `border-bottom: 1px solid ${theme.grey20}` : ''};
  height: 60px;
  display: flex;
  align-items: center;
  z-index: 9;
  background-color: ${theme.primaryBlack};
  @media (max-width: 600px) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
`

const PageHeader: React.FC<PageHeaderProps> = ({
  children,
  hasBorderBottom,
  id,
  load,
  loading,
  mobileBreakpoint,
  subtitle,
  testId,
  title,
}) => {
  const queryClient = useQueryClient()
  const queryClientFetching = useIsFetching()
  const refresh = useCallback(() => {
    queryClient.refetchQueries({ type: 'active' })
  }, [queryClient])

  return (
    <PageHeaderContainer
      $hasBorderBottom={hasBorderBottom}
      $mobileBreakpoint={mobileBreakpoint}
      data-testid={testId}
      id={id}
    >
      <RefreshButton
        load={load || refresh}
        loading={loading || queryClientFetching > 0}
      />
      <div>
        {title && <PageTitle title={title} />}
        {subtitle && <div>{subtitle}</div>}
      </div>
      {children}
    </PageHeaderContainer>
  )
}
export default PageHeader
