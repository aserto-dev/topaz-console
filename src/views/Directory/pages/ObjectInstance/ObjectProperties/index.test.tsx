import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { screen } from '@testing-library/react'

import ObjectProperties from '.'
import { getDirectoryReaderV3ObjectGetResponseMock } from '../../../../../api/v3/directory.msw'
import { ObjectFactory } from '../../../../../testing/factories/directory'
import { handlers } from '../../../../../testing/handlers'
import { renderWithProviders } from '../../../../../testing/render'

describe('<ObjectProperties />', () => {
  const object = ObjectFactory.build({
    properties: {
      email: 'test@aserto.com',
      foo: {
        bar: 'baz',
      },
      picture: 'my-picture',
    },
    type: 'user',
  })

  const server = setupServer(
    ...handlers,
    http.get('*/api/v3/directory/object', () => {
      return HttpResponse.json(
        getDirectoryReaderV3ObjectGetResponseMock({
          result: object,
        }),
      )
    }),
  )
  beforeAll(() => {
    server.listen({ onUnhandledRequest: () => 'warn' })
  })

  beforeEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it('display object properties', async () => {
    renderWithProviders(<ObjectProperties object={object} />)

    expect(await screen.findByText(`"email"`)).toBeVisible()
    expect(await screen.findByText(`"test@aserto.com"`)).toBeVisible()
    expect(await screen.findByText(`"my-picture"`)).toBeVisible()
  })
})
