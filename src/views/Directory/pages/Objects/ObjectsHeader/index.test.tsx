import { setupServer } from 'msw/node'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { act, fireEvent, screen, waitFor } from '@testing-library/react'

import ObjectsHeader from '.'
import { handlers } from '../../../../../testing/handlers'
import { renderWithProviders } from '../../../../../testing/render'

describe('<ObjectsHeader />', () => {
  const server = setupServer(...handlers)
  beforeAll(() => {
    server.listen({ onUnhandledRequest: () => 'warn' })
  })

  beforeEach(() => {
    vi.mock('react-router', async () => {
      const mod = await vi.importActual('react-router')
      return {
        ...mod,
        useParams: () => ({
          objectType: 'user',
        }),
      }
    })
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it('renders the Add Button', async () => {
    renderWithProviders(<ObjectsHeader />)
    await waitFor(async () => {
      expect(await screen.findByText('Add')).toBeVisible()
    })
  })

  it('has an AddObject modal', async () => {
    renderWithProviders(<ObjectsHeader />)

    expect(await screen.findByText('Add')).toBeVisible()

    const AddButton = await screen.findByText('Add')
    act(() => {
      fireEvent.click(AddButton)
    })
    expect(await screen.findByText('Add user')).toBeVisible()
    expect(await screen.findByText('ID')).toBeVisible()
    expect(await screen.findByText('Display Name')).toBeVisible()
  })
})
