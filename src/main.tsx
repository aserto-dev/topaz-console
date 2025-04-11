import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GlobalStyle } from './globalStyles.ts'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme.ts'
import DirectoryContextProvider from './services/DirectoryContextProvider/index.tsx'
import ConfigProvider from './services/ConfigProvider/index.tsx'
import SuccessBannerProvider from './services/SuccessBannerProvider/provider.tsx'
import ErrorModalProvider from './services/ErrorModalProvider/provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorModalProvider>
        <BrowserRouter>
          <GlobalStyle />
          <ThemeProvider theme={theme}>
            <SuccessBannerProvider>
              <ConfigProvider>
                <DirectoryContextProvider
                  displayState={{
                    canAddObject: { enabled: true, visible: true },
                    canAddRelation: { enabled: true, visible: true },
                    canDeleteDirectory: { enabled: true, visible: true },
                    canEditManifest: { enabled: true, visible: true },
                    canEditObject: { enabled: true, visible: true },
                    canRemoveRelation: { enabled: true, visible: true },
                    canRemoveAssertion: { enabled: true, visible: true },
                    canAddAssertion: { enabled: true, visible: true },
                    canEditAssertion: { enabled: true, visible: true },
                  }}
                >
                  <App />
                </DirectoryContextProvider>
              </ConfigProvider>
            </SuccessBannerProvider>
          </ThemeProvider>
        </BrowserRouter>
      </ErrorModalProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
