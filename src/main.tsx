import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/work-sans/400.css'
import '@fontsource/work-sans/500.css'
import '@fontsource/work-sans/700.css'
import '@fontsource/work-sans/800.css'
import '@fontsource/libre-caslon-text/400.css'
import '@fontsource/libre-caslon-text/400-italic.css'
import '@fontsource/libre-caslon-text/700.css'
import './index.css'
import App from './App.tsx'
import { startFaviconAnimation } from './faviconAnim'

startFaviconAnimation()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
