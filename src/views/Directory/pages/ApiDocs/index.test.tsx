import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import { ApiBrowserProps } from '../../../../components/ApiBrowser'
import { useConfig } from '../../../../services/ConfigProvider/hooks'
import DirectoryApiDocs from './index'

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

describe('DirectoryApiDocs', () => {
  const mockConfig = {
    directoryApiKey: 'test-api-key',
    directoryServiceUrl: 'http://test-service-url',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useConfig as ReturnType<typeof vi.fn>).mockReturnValue(mockConfig)
  })

  it('renders the ApiBrowser component', () => {
    render(<DirectoryApiDocs />)
    expect(screen.getByTestId('api-browser')).toBeInTheDocument()
  })

  it('passes the correct API key to ApiBrowser', () => {
    render(<DirectoryApiDocs />)
    const apiBrowser = screen.getByTestId('api-browser')
    expect(apiBrowser).toHaveAttribute(
      'data-api-keys',
      JSON.stringify([
        {
          key: 'DirectoryAPIKey',
          value: 'Basic test-api-key',
        },
      ]),
    )
  })

  it('passes the correct OpenAPI URL to ApiBrowser', () => {
    render(<DirectoryApiDocs />)
    const apiBrowser = screen.getByTestId('api-browser')
    expect(apiBrowser).toHaveAttribute(
      'data-open-api-url',
      'http://test-service-url/directory/openapi.json',
    )
  })

  it('handles missing API key gracefully', () => {
    ;(useConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockConfig,
      directoryApiKey: undefined,
    })
    render(<DirectoryApiDocs />)
    const apiBrowser = screen.getByTestId('api-browser')
    expect(apiBrowser).toHaveAttribute(
      'data-api-keys',
      JSON.stringify([
        {
          key: 'DirectoryAPIKey',
          value: '',
        },
      ]),
    )
  })
})
