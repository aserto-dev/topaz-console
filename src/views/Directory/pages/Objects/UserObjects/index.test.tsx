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

import UserObjects from '.'
import {
  getDirectoryReaderV3ObjectsListMockHandler,
  getDirectoryReaderV3ObjectsListResponseMock,
} from '../../../../../api/v3/directory.msw'
import { ObjectFactory } from '../../../../../testing/factories/directory'
import { handlers } from '../../../../../testing/handlers'
import { renderWithProviders } from '../../../../../testing/render'
import { parseAsUserProperties } from '../../../../../types/user'

const server = setupServer()

describe('<UserObjects />', () => {
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
  })
  describe('no objects', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
    beforeEach(() => {
      server.use(...handlers)
    })
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('renders no data page', async () => {
      renderWithProviders(<UserObjects />)

      expect(
        await screen.findByText(
          'To add one, click the "Add" button in the top left.',
        ),
      ).toBeVisible()
    })
  })

  describe('no users', () => {
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
      renderWithProviders(<UserObjects />)

      expect(
        await screen.findByText(
          'To add one, click the "Add" button in the top left.',
        ),
      ).toBeVisible()
    })
  })

  describe('with users', () => {
    const userObject = ObjectFactory.build({
      id: 'user1',
      properties: { email: 'test2@aserto.com' },
      type: 'user',
    })

    const userObject2 = ObjectFactory.build({
      id: 'user2',
      properties: { email: 'test2@aserto.com' },
      type: 'user',
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
              results: [userObject, userObject2],
            }),
          )
        }),
      )
    })
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('renders user details', async () => {
      renderWithProviders(<UserObjects />)

      const userProps = parseAsUserProperties(userObject.properties)
      const user2Props = parseAsUserProperties(userObject2.properties)
      // assert user objects existence
      expect(await screen.findByText(userObject.id)).toBeVisible()
      expect(await screen.findByText(userObject.display_name!)).toBeVisible()

      const userEmailElement = await screen.findAllByText(
        (_, element) => element?.textContent === userProps.email,
      )
      expect(userEmailElement[0]).toBeVisible()

      expect(await screen.findByText(userObject2.id)).toBeVisible()
      expect(await screen.findByText(userObject2.display_name!)).toBeVisible()

      const user2EmailElement = await screen.findAllByText(
        (_, element) => element?.textContent === user2Props.email,
      )
      expect(user2EmailElement[0]).toBeVisible()

      // assert that other objects are filtered out
      await waitFor(async () => {
        expect(screen.queryByText(object.id)).toBeNull()
      })

      const user1Link = (
        await screen.findByText(userObject.display_name!)
      ).closest('a')
      expect(user1Link).toHaveAttribute(
        'href',
        '/ui/directory/objects/user/user1',
      )
    })
  })
})
