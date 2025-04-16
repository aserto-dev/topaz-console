import { defineConfig } from 'orval';

export default defineConfig({
  authorizer: {
    input: {
      target: process.env.AUTHORIZER_SERVICE_URL
        ? `${process.env.AUTHORIZER_SERVICE_URL}/openapi.json`
        : `https://raw.githubusercontent.com/aserto-dev/openapi-authorizer/refs/heads/main/publish/authorizer/openapi.json`,
    },
    output: {
      clean: false,
      client: 'react-query',
      mock: true,
      mode: 'split',
      override: {
        mutator: {
          name: 'useAuthorizerClient',
          path: 'src/api/clients/rest.ts',
        },
      },
      schemas: 'src/types/authorizer',
      target: 'src/api/v3/authorizer.ts',
    },
  },
  directory: {
    input: {
      target: process.env.DIRECTORY_SERVICE_URL
        ? `${process.env.DIRECTORY_SERVICE_URL}/openapi.json`
        : 'https://raw.githubusercontent.com/aserto-dev/openapi-directory/refs/heads/main/publish/directory/openapi.json',
    },
    output: {
      clean: false,
      client: 'react-query',
      mock: true,
      mode: 'split',
      override: {
        mutator: {
          name: 'useDirectoryReaderClient',
          path: 'src/api/clients/rest.ts',
        },
        operations: {
          'directory.assertion.v3.assertions.list': {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: "'page.token'",
              useQuery: true,
            },
          },
          'directory.model.v3.manifest.delete': {
            mutator: {
              name: 'useDirectoryModelClient',
              path: 'src/api/clients/rest.ts',
            },
          },
          'directory.reader.v3.objects.list': {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: "'page.token'",
              useQuery: true,
            },
          },
          'directory.reader.v3.relations.list': {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: "'page.token'",
              useQuery: true,
            },
          },
          'directory.v3.manifest.get': {
            mutator: {
              name: 'useDirectoryModelClient',
              path: 'src/api/clients/rest.ts',
            },
          },
          'directory.v3.manifest.set': {
            mutator: {
              name: 'useDirectoryModelClient',
              path: 'src/api/clients/rest.ts',
            },
          },
          'directory.writer.v3.object.delete': {
            mutator: {
              name: 'useDirectoryWriterClient',
              path: 'src/api/clients/rest.ts',
            },
          },
          'directory.writer.v3.object.set': {
            mutator: {
              name: 'useDirectoryWriterClient',
              path: 'src/api/clients/rest.ts',
            },
          },
          'directory.writer.v3.relation.delete': {
            mutator: {
              name: 'useDirectoryWriterClient',
              path: 'src/api/clients/rest.ts',
            },
          },
          'directory.writer.v3.relation.set': {
            mutator: {
              name: 'useDirectoryWriterClient',
              path: 'src/api/clients/rest.ts',
            },
          },
        },
      },
      schemas: 'src/types/directory',
      target: 'src/api/v3/directory.ts',
    },
  }
})
