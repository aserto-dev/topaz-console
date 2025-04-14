// Model:
// 'directory.v3.manifest.get',
// 'directory.writer.v3.manifest.set',
// 'directory.writer.v3.manifest.delete',

// Writer:
// 'directory.writer.v3.object.set',
// 'directory.writer.v3.object.delete',
// 'directory.writer.v3.relation.delete',
// 'directory.writer.v3.relation.set',

import { defineConfig } from 'orval';

export default defineConfig({
  directory: {
    output: {
      mode: 'single',
      target: 'src/api/v3/directory.ts',
      schemas: 'src/types/directory',
      client: 'react-query',
      clean: true,
      mock: false,
      override: {
        operations: {
          'directory.v3.manifest.get': {
            mutator: {
              path: 'src/api/clients/rest.ts',
              name: 'useDirectoryModelClient',
            },
          },
          'directory.v3.manifest.set': {
            mutator: {
              path: 'src/api/clients/rest.ts',
              name: 'useDirectoryModelClient',
            },
          },
          'directory.model.v3.manifest.delete': {
            mutator: {
              path: 'src/api/clients/rest.ts',
              name: 'useDirectoryModelClient',
            },
          },
          'directory.writer.v3.object.set': {
            mutator: {
              path: 'src/api/clients/rest.ts',
              name: 'useDirectoryWriterClient',
            },
          },
          'directory.writer.v3.object.delete': {
            mutator: {
              path: 'src/api/clients/rest.ts',
              name: 'useDirectoryWriterClient',
            },
          },
          'directory.writer.v3.relation.set': {
            mutator: {
              path: 'src/api/clients/rest.ts',
              name: 'useDirectoryWriterClient',
            },
          },
          'directory.writer.v3.relation.delete': {
            mutator: {
              path: 'src/api/clients/rest.ts',
              name: 'useDirectoryWriterClient',
            },
          },
          'directory.reader.v3.objects.list': {
            query: {
              useQuery: true,
              useInfinite: true,
              useInfiniteQueryParam: "'page.token'",
            },
          },
          'directory.reader.v3.relations.list': {
            query: {
              useQuery: true,
              useInfinite: true,
              useInfiniteQueryParam: "'page.token'",
            },
          },
          'directory.assertion.v3.assertions.list': {
            query: {
              useQuery: true,
              useInfinite: true,
              useInfiniteQueryParam: "'page.token'",
            },
          },
        },
        mutator: {
          path: 'src/api/clients/rest.ts',
          name: 'useDirectoryReaderClient',
        },
      },
    },
    input: {
      target: process.env.DIRECTORY_SERVICE_URL
        ? `${process.env.DIRECTORY_SERVICE_URL}/openapi.json`
        : 'https://directory.prod.aserto.com/openapi.json',
    },
  },
})
