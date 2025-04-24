import { defineConfig } from 'vite'

import { codecovVitePlugin } from "@codecov/vite-plugin";
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
         manualChunks: {
           'monaco-react': ['@monaco-editor/react'],
           'monaco-yaml': ['monaco-yaml'],
           'monaco-yaml-worker': ['monaco-yaml/yaml.worker.js'],
           'rapidoc': ['rapidoc'],
         },
      },
    },
  },
  plugins: [
    react(),
    codecovVitePlugin({
      bundleName: "topaz-console",
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  server: {
    port: 3000,
  },
})
