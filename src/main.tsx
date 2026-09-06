import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './lib/theme.tsx'
import { CartProvider } from './lib/cart-context.tsx'
import { OrdersProvider } from './lib/orders-context.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { queryClient } from './lib/queryClient'
import { store } from './store'
import { SessionProvider } from './components/auth/session-provider'
import { ErrorBoundary } from './components/error/error-boundary'
import { OfflineState } from './components/error/offline-state'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <ThemeProvider>
              <CartProvider>
                <OrdersProvider>
                  <App />
                  <Toaster />
                  <OfflineState />
                </OrdersProvider>
              </CartProvider>
            </ThemeProvider>
          </SessionProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
