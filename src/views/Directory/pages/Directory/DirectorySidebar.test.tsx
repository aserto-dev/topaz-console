import { setupServer } from 'msw/node'
import { act } from 'react'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { fireEvent, screen } from '@testing-library/react'

import { handlers } from '../../../../testing/handlers'
import { renderWithProviders } from '../../../../testing/render'
import { DirectorySidebar } from './DirectorySidebar'

describe('<DirectorySidebar />', () => {
  const server = setupServer(...handlers)

  beforeAll(() => {
    server.listen({ onUnhandledRequest: () => 'error' })
  })

  beforeEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it('renders the sidebar with the correct categories', async () => {
    renderWithProviders(<DirectorySidebar />)
    expect(await screen.findByText('Model')).toBeVisible()
    expect(await screen.findByText('Relations')).toBeVisible()
    expect(await screen.findByText('Objects')).toBeVisible()
    expect(await screen.findByText('API Browser')).toBeVisible()
    expect(await screen.findByText('Evaluator')).toBeVisible()
    expect(await screen.findByText('Danger Zone')).toBeVisible()
  })

  describe('Objects', () => {
    it('is set as active by navigation', async () => {
      renderWithProviders(<DirectorySidebar />, {
        memoryRouterConfig: { initialEntries: ['/ui/directory/objects'] },
      })

      expect(await screen.findByText('Objects')).toBeVisible()
      expect(await screen.findByText('Objects')).toHaveClass('active')
    })

    it('is set as active on Click', async () => {
      renderWithProviders(<DirectorySidebar />)
      expect(await screen.findByText('Objects')).toBeVisible()
      expect(await screen.findByText('Objects')).not.toHaveClass('active')

      const Objects = await screen.findByText('Objects')
      act(() => {
        fireEvent.click(Objects)
      })

      expect(await screen.findByText('Objects')).toHaveClass('active')

      // check for suboptions
      expect(await screen.findByText('User')).toBeVisible()
      expect(await screen.findByText('Group')).toBeVisible()
      expect(await screen.findByText('Application')).toBeVisible()
      expect(await screen.findByText('Identity')).toBeVisible()
      expect(await screen.findByText('Resource')).toBeVisible()
      expect(await screen.findByText('System')).toBeVisible()
      expect(await screen.findByText('Null Type 1')).toBeVisible()
      expect(await screen.findByText('Null Type 2')).toBeVisible()
      expect(await screen.findByText('Empty Type 1')).toBeVisible()
    })
  })

  describe('Evaluator', () => {
    it('is set as active by navigation', async () => {
      renderWithProviders(<DirectorySidebar />, {
        memoryRouterConfig: { initialEntries: ['/ui/directory/evaluator'] },
      })

      const evaluatorElements = await screen.findAllByText('Evaluator')

      expect(evaluatorElements[0]).toBeVisible()
      expect(evaluatorElements[0]).toHaveClass('active')
    })
    it('is set as active on Click', async () => {
      renderWithProviders(<DirectorySidebar />)
      expect(await screen.findByText('Evaluator')).toBeVisible()
      expect(await screen.findByText('Evaluator')).not.toHaveClass('active')

      const Evaluator = await screen.findByText('Evaluator')
      act(() => {
        fireEvent.click(Evaluator)
      })

      const evaluatorElements = await screen.findAllByText('Evaluator')
      expect(evaluatorElements[0]).toHaveClass('active')
    })
  })
})
