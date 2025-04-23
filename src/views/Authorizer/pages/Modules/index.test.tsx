import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import { screen, waitFor } from '@testing-library/react'

import { getPoliciesListResponseMock } from '../../../../api/v3/authorizer.msw'
import { handlers } from '../../../../testing/handlers'
import { renderWithProviders } from '../../../../testing/render'
import Modules from './index'

const server = setupServer()

describe('Modules', () => {
  beforeAll(() => server.listen())
  beforeEach(() => {
    server.use(...handlers)
  })
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('should show loading state initially', () => {
    server.use(
      http.get('*/api/v2/policies', () => {
        return new HttpResponse(JSON.stringify({}), {
          headers: { 'Content-Type': 'application/json' },
        })
      }),
    )

    renderWithProviders(<Modules />)
    expect(screen.queryByText('Module Name')).not.toBeInTheDocument()
  })

  it('should display modules list when data is loaded', async () => {
    const mockModules = getPoliciesListResponseMock({
      result: [
        {
          id: '1',
          package_path: 'test.module1',
          raw: 'package test.module1',
        },
        {
          id: '2',
          package_path: 'test.module2',
          raw: 'package test.module2',
        },
      ],
    })

    server.use(
      http.get('*/api/v2/policies', () => {
        return HttpResponse.json(mockModules)
      }),
    )

    renderWithProviders(<Modules />)

    await waitFor(() => {
      expect(screen.getByText('test.module1')).toBeInTheDocument()
      expect(screen.getByText('test.module2')).toBeInTheDocument()
    })
  })

  it('should display module content when a module is selected', async () => {
    const mockModules = getPoliciesListResponseMock({
      result: [
        {
          id: '1',
          package_path: 'test.module1',
          raw: 'package test.module1\n\nallow = true',
        },
      ],
    })

    server.use(
      http.get('*/api/v2/policies', () => {
        return HttpResponse.json(mockModules)
      }),
    )

    renderWithProviders(<Modules />)

    await waitFor(() => {
      expect(
        screen.getAllByText(
          (_, element) => element?.textContent === 'test.module1',
        )[0],
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          (_, element) => element?.textContent === 'package test.module1\n',
        ),
      ).toBeInTheDocument()

      expect(
        screen.getByText(
          (_, element) => element?.textContent === 'allow = true',
        ),
      ).toBeInTheDocument()
    })
  })

  it('should handle API error gracefully', async () => {
    server.use(
      http.get('*/api/v2/policies', () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    renderWithProviders(<Modules />)

    await waitFor(() => {
      expect(screen.queryByText('Module Name')).toBeNull()
    })
  })
})
