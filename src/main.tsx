import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const queryClient = new QueryClient()
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GlobalStyle } from './globalStyles'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import ConfigProvider from './services/ConfigProvider/index'
import SuccessBannerProvider from './services/SuccessBannerProvider/index'
import ErrorModalProvider from './services/ErrorModalProvider/provider'
import AuthProvider from './services/AuthProvider/index'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorModalProvider>
        <BrowserRouter>
          <GlobalStyle />
          <ThemeProvider theme={theme}>
            <SuccessBannerProvider>
              <ConfigProvider>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </ConfigProvider>
            </SuccessBannerProvider>
          </ThemeProvider>
        </BrowserRouter>
      </ErrorModalProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
