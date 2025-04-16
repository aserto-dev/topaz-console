import { defineConfig } from 'vite'

import { codecovVitePlugin } from "@codecov/vite-plugin";
import react from '@vitejs/plugin-react-swc'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), codecovVitePlugin({
    bundleName: "topaz-console",
    enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
    uploadToken: process.env.CODECOV_TOKEN,
  }),],
  server: {
    port: 3000,
  },
})
