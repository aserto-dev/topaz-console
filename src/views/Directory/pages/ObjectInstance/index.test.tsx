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
  vi,
} from 'vitest'

import { screen } from '@testing-library/react'

import ObjectInstanceRouter from '.'
import { getDirectoryReaderV3ObjectGetResponseMock } from '../../../../api/v3/directory.msw'
import { ObjectFactory } from '../../../../testing/factories/directory'
import { handlers } from '../../../../testing/handlers'
import { mockReactFlow } from '../../../../testing/reactflow'
import { renderWithProviders } from '../../../../testing/render'

const mocks = vi.hoisted(() => {
  return {
    useParams: vi.fn(),
  }
})

vi.mock('react-router', async () => {
  const mod = await vi.importActual('react-router')
  return {
    ...mod,
    useParams: mocks.useParams,
  }
})

describe(`<ObjectInstace />`, () => {
  const testObjects = [
    ObjectFactory.build({
      id: 'user/1',
      type: 'user',
    }),
    ObjectFactory.build({
      id: 'user[1',
      type: 'user',
    }),
    ObjectFactory.build({
      id: 'user]1',
      type: 'user',
    }),
    ObjectFactory.build({
      id: 'user\\1',
      type: 'user',
    }),
    ObjectFactory.build({
      id: 'user|1',
      type: 'user',
    }),
    ObjectFactory.build({
      id: 'user&1',
      type: 'user',
    }),
    ObjectFactory.build({
      id: 'user^1',
      type: 'user',
    }),
    ObjectFactory.build({
      id: 'user$1',
      type: 'user',
    }),
    ObjectFactory.build({
      id: 'user@1',
      type: 'user',
    }),
    ObjectFactory.build({
      id: 'user+1',
      type: 'user',
    }),
    ObjectFactory.build({
      id: 'user!@#$%^&*()_+-=1',
      type: 'user',
    }),
  ]

  describe('Pages', () => {
    const object = testObjects[0]

    beforeEach(() => {
      mockReactFlow()

      mocks.useParams.mockReturnValue({
        objectId: object.id,
        objectType: object.type,
      })
    })

    const server = setupServer(...handlers)

    beforeAll(() => {
      server.listen({ onUnhandledRequest: () => 'warn' })
    })

    beforeEach(() => {
      server.resetHandlers()
    })

    afterAll(() => {
      server.close()
    })

    afterEach(() => {
      vi.resetAllMocks()
    })

    describe('Header', () => {
      beforeEach(() => {
        server.use(
          ...handlers,
          http.get('*/api/v3/directory/object', () => {
            return HttpResponse.json(
              getDirectoryReaderV3ObjectGetResponseMock({
                result: object,
              }),
            )
          }),
        )
      })
      it('renders Header', async () => {
        renderWithProviders(<ObjectInstanceRouter />)

        // assert correct user
        expect((await screen.findAllByText(object.id))[0]).toBeVisible()

        // assert correct elements
        expect(await screen.findByText('Edit')).toBeVisible()
        expect(await screen.findByText('Delete')).toBeVisible()
        expect(await screen.findByText('Properties')).toBeVisible()
        expect(await screen.findByText('Incoming Relations')).toBeVisible()
        expect(await screen.findByText('Outgoing Relations')).toBeVisible()
        expect(await screen.findByText('JSON')).toBeVisible()
      })
    })

    describe('Properties', () => {
      beforeEach(() => {
        server.use(
          ...handlers,
          http.get('*/api/v3/directory/object', () => {
            return HttpResponse.json(
              getDirectoryReaderV3ObjectGetResponseMock({
                result: object,
              }),
            )
          }),
        )
      })
      it('renders Properties details', async () => {
        renderWithProviders(<ObjectInstanceRouter />, {
          memoryRouterConfig: { initialEntries: ['/properties'] },
        })

        // assert correct view
        const properties = await screen.findByText('Properties')
        expect(properties).toBeVisible()

        const propertiesLink = properties.closest('a')
        expect(propertiesLink).toHaveAttribute(
          'href',
          '/ui/directory/objects/user/user/1/properties',
        )

        // assert correct elements
        expect(await screen.findByText('Cancel')).toBeVisible()
        expect(await screen.findByText('Save')).toBeVisible()
      })
    })
  })

  for (const object of testObjects) {
    describe(`with ${object.id}`, () => {
      beforeEach(() => {
        mockReactFlow()
        mocks.useParams.mockReturnValue({
          objectId: object.id,
          objectType: object.type,
        })
      })

      const server = setupServer(...handlers)

      beforeAll(() => {
        server.listen({ onUnhandledRequest: () => 'warn' })
      })

      beforeEach(() => {
        server.resetHandlers()
      })

      afterAll(() => {
        server.close()
      })

      afterEach(() => {
        vi.resetAllMocks()
      })
      describe('Graph', () => {
        beforeEach(() => {
          server.use(
            ...handlers,
            http.get('*/api/v3/directory/object', () => {
              return HttpResponse.json(
                getDirectoryReaderV3ObjectGetResponseMock({
                  result: object,
                }),
              )
            }),
          )
        })
        it('renders Graph details', async () => {
          renderWithProviders(<ObjectInstanceRouter />)

          // assert correct view
          const graph = await screen.findByText('Graph')
          expect(graph).toBeVisible()
          const graphLink = graph.closest('a')

          expect(graphLink).toHaveAttribute(
            'href',
            `/ui/directory/objects/${object.type}/${object.id}/graph`,
          )

          // assert correct user
          expect((await screen.findAllByText(object.id))[0]).toBeVisible()

          // assert correct elements
          expect(await screen.findByText('Edit')).toBeVisible()
          expect(await screen.findByText('Delete')).toBeVisible()
          expect(await screen.findByText('Properties')).toBeVisible()
          expect(await screen.findByText('Incoming Relations')).toBeVisible()
          expect(await screen.findByText('Outgoing Relations')).toBeVisible()
          expect(await screen.findByText('JSON')).toBeVisible()
        })
      })
    })
  }
})
