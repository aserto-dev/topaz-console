import { http, HttpResponse } from "msw"

const MANIFEST = `
model:
  version: 3
types:
  ### display_name: User ###
  user:
    relations:
      manager: user
  # extra comment
  ### display_name: Group ###
  group:
    relations:
      member: user
  ### display_name: Identity ###
  # extra comment
  identity:
    relations:
      identifier: user

  ### display_name: Application ###
  application:
    relations:
      application-user: user
  ### display_name: Resource ###

  resource: {}


  ### display_name: System ###

  system:
    relations:
      system-user: user

  ### display_name: Null Type 1 ###
  null-type1:

  ### display_name: Null Type 2 ###
  null-type2: null

  ### display_name: Empty Type 1 ###
  empty-type1: {}
` as const


export const handlers = [
  http.get('/api/v2/config', () => {
    return new HttpResponse(
      JSON.stringify({
        authenticationType: 'anonymous',
        configs: [
          {
            address: '/api/v2/config',
            authorizerApiKey: '',
            authorizerServiceUrl: 'https://localhost:8383',
            configType: 'auto',
            directoryApiKey: '',
            directoryModelServiceUrl: 'https://localhost:9393',
            directoryReaderServiceUrl: 'https://localhost:9393',
            directoryServiceUrl: 'https://localhost:9393',
            directoryTenantId: '',
            directoryWriterServiceUrl: 'https://localhost:9393',
            name: 'Topaz Config',
          },
        ],
        readOnly: true,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }),

  http.get(
    `https://localhost:9393/api/v3/directory/manifest`,() => {
      return HttpResponse.arrayBuffer(Buffer.from(MANIFEST, 'utf8'), {
        headers: {
          'Content-Type': 'application/yaml',
        },

      })
    })
]
