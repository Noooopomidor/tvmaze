import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './app/App'
import { store } from './store'
import { syncSearchLocation } from './store/search/syncSearchLocation'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element was not found')
}

const stopLocationSync = syncSearchLocation(store)
if (import.meta.hot) import.meta.hot.dispose(stopLocationSync)

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
