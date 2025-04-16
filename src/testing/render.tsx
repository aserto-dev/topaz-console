import React, { PropsWithChildren } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, RenderOptions } from '@testing-library/react'

import AuthProvider from '../services/AuthProvider'
import ConfigProvider from '../services/ConfigProvider'

type WrapperConfig = {
  memoryRouterConfig?: {
    initialEntries?: string[]
  }
  queryClientConfig?: ConstructorParameters<typeof QueryClient>[0]
}

function getContextWrapper(
  config: WrapperConfig = {},
): React.FC<PropsWithChildren> {
  const queryClient = new QueryClient(
    config.queryClientConfig || {
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    },
  )

  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <AuthProvider>{children}</AuthProvider>
        </ConfigProvider>
      </QueryClientProvider>
    )
  }
}

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    renderOptions,
    ...wrapperConfig
  }: WrapperConfig & { renderOptions?: RenderOptions } = {},
) => {
  const wrapper = getContextWrapper(wrapperConfig)
  return render(ui, { ...renderOptions, wrapper })
}
