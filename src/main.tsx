import { StrictMode } from 'react'
import { Provider } from 'react-redux'

import { createRoot } from 'react-dom/client'

import { ThemeProvider } from '@/lib/theme-provider'
import { store } from '@/store'

import App from './App'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
