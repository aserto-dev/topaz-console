import { http, HttpResponse } from "msw"

export const handlers = [
  http.get('https://localhost:8080/api/v2/config', () => {
    return new HttpResponse(
      JSON.stringify({
        authenticationType: 'anonymous',
        configs: [
          {
            address: 'https://localhost:8080/api/v2/config',
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
]
