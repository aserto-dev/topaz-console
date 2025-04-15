import React from 'react'
import styled, { keyframes } from 'styled-components'

import { theme } from '../../../theme'
import Button from '../Button'

const RefreshButtonContainer = styled(Button)`
  position: absolute;
  right: 20px;
  border: 1px solid ${theme.grey};
  border-radius: 4px;
  background-color: ${theme.grey20};
  background-size: cover;
  font-size: 14px;
  color: ${theme.grey100};
  text-align: center;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: none;
  outline: none;
  gap: 4px;
  @media (max-width: 600px) {
    width: auto;
    i {
      margin: auto;
    }
    span {
      display: none;
    }
  }
`

const LoadKeyFrame = keyframes`
  from {
      transform:rotate(0deg);
  }
  to {
      transform:rotate(360deg);
  }
`

const SpinAnimator = styled.div<{ $spin: boolean }>`
  margin: auto;
  width: 50%;
  animation: ${LoadKeyFrame} ${({ $spin }) => ($spin ? '1000ms' : '0ms')}
    infinite linear;
`

type RefreshButtonProps = {
  load?: () => void
  loading?: boolean
  testId?: string
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  load,
  loading,
  testId,
}) => (
  <RefreshButtonContainer
    data-testid={testId}
    variant="secondary"
    onClick={load}
  >
    {loading ? (
      <SpinAnimator $spin={loading}>
        <i className="fa fa-refresh" />
      </SpinAnimator>
    ) : (
      <i className="fa fa-refresh" />
    )}
    <span>&nbsp;Refresh</span>
  </RefreshButtonContainer>
)
export default RefreshButton
