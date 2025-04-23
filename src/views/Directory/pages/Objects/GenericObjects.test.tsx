import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterEach } from 'node:test'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { screen, waitFor } from '@testing-library/react'

import {
  getDirectoryReaderV3ObjectsListMockHandler,
  getDirectoryReaderV3ObjectsListResponseMock,
} from '../../../../api/v3/directory.msw'
import { ObjectFactory } from '../../../../testing/factories/directory'
import { handlers } from '../../../../testing/handlers'
import { renderWithProviders } from '../../../../testing/render'
import GenericObjects from './GenericObjects'

const server = setupServer()

describe('<GenericObjects /> for groups', () => {
  beforeEach(() => {
    vi.mock('react-router', async () => {
      const mod = await vi.importActual('react-router')
      return {
        ...mod,
        useParams: () => ({
          objectType: 'group',
        }),
      }
    })
  })
  describe('no objects', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
    beforeEach(() => {
      server.use(...handlers)
    })
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('renders no data page', async () => {
      renderWithProviders(<GenericObjects />)

      expect(
        await screen.findByText(
          'To add one, click the "Add" button in the top left.',
        ),
      ).toBeVisible()
    })
  })

  describe('no groups', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
    beforeEach(() => {
      server.use(
        ...handlers,
        getDirectoryReaderV3ObjectsListMockHandler({ results: [] }),
      )
    })
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())
    it('renders no data page', async () => {
      renderWithProviders(<GenericObjects />)

      expect(
        await screen.findByText(
          'To add one, click the "Add" button in the top left.',
        ),
      ).toBeVisible()
    })
  })

  describe('with groups', () => {
    const groupObject = ObjectFactory.build({
      id: 'group/1',
      type: 'group',
    })

    const groupObject2 = ObjectFactory.build({
      type: 'group',
    })

    const object = ObjectFactory.build({
      type: 'object',
    })

    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
    beforeEach(() => {
      server.use(
        ...handlers,
        http.get('*/api/v3/directory/objects', () => {
          return HttpResponse.json(
            getDirectoryReaderV3ObjectsListResponseMock({
              results: [groupObject, groupObject2],
            }),
          )
        }),
      )
    })
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it.skip('renders group details', async () => {
      renderWithProviders(<GenericObjects />)

      // assert group objects existence
      expect(await screen.findByText(groupObject.id)).toBeVisible()
      expect(await screen.findByText(groupObject.display_name!)).toBeVisible()

      expect(await screen.findByText(groupObject2.id)).toBeVisible()
      expect(await screen.findByText(groupObject2.display_name!)).toBeVisible()

      // assert that other objects are filtered out
      await waitFor(async () => {
        expect(screen.queryByText(object.id)).toBeNull()
      })

      const group1Link = (
        await screen.findByText(groupObject.display_name!)
      ).closest('a')
      expect(group1Link).toHaveAttribute(
        'href',
        '/ui/directory/objects/group/group%2F1',
      )
    })
  })
})
