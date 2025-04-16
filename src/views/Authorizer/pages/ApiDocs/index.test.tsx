import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import { ApiBrowserProps } from '../../../../components/ApiBrowser'
import { useConfig } from '../../../../services/ConfigProvider/hooks'
import AuthorizerApiDocs from './index'

// Mock the useConfig hook
vi.mock('../../../../services/ConfigProvider/hooks', () => ({
  useConfig: vi.fn(),
}))

// Mock the ApiBrowser component
vi.mock('../../../../components/ApiBrowser', () => {
  return {
    default: function MockApiBrowser({ apiKeys, openApiUrl }: ApiBrowserProps) {
      return (
        <div
          data-api-keys={JSON.stringify(apiKeys)}
          data-open-api-url={openApiUrl}
          data-testid="api-browser"
        />
      )
    },
  }
})

describe('AuthorizerApiDocs', () => {
  const mockConfig = {
    authorizerApiKey: 'test-api-key',
    authorizerServiceUrl: 'http://test-service-url',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useConfig as ReturnType<typeof vi.fn>).mockReturnValue(mockConfig)
  })

  it('renders the ApiBrowser component', () => {
    render(<AuthorizerApiDocs />)
    expect(screen.getByTestId('api-browser')).toBeInTheDocument()
  })

  it('passes the correct API key to ApiBrowser', () => {
    render(<AuthorizerApiDocs />)
    const apiBrowser = screen.getByTestId('api-browser')
    expect(apiBrowser).toHaveAttribute(
      'data-api-keys',
      JSON.stringify([
        {
          key: 'AuthorizerAPIKey',
          value: 'Basic test-api-key',
        },
      ]),
    )
  })

  it('passes the correct OpenAPI URL to ApiBrowser', () => {
    render(<AuthorizerApiDocs />)
    const apiBrowser = screen.getByTestId('api-browser')
    expect(apiBrowser).toHaveAttribute(
      'data-open-api-url',
      'http://test-service-url/authorizer/openapi.json',
    )
  })

  it('handles missing API key gracefully', () => {
    ;(useConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockConfig,
      authorizerApiKey: undefined,
    })
    render(<AuthorizerApiDocs />)
    const apiBrowser = screen.getByTestId('api-browser')
    expect(apiBrowser).toHaveAttribute(
      'data-api-keys',
      JSON.stringify([
        {
          key: 'AuthorizerAPIKey',
          value: '',
        },
      ]),
    )
  })
})
