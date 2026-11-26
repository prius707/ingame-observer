import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/work-sans/latin-400.css'
import '@fontsource/work-sans/latin-700.css'
import '@fontsource/work-sans/latin-800.css'
import '@fontsource/libre-caslon-text/latin-400.css'
import '@fontsource/libre-caslon-text/latin-400-italic.css'
import '@fontsource/libre-caslon-text/latin-700.css'
import './index.css'
import App from './App.tsx'
import { DISCORD_INVITE } from './data'

/** /discord is a static redirect page; if the SPA still loads, bounce out. */
function redirectDiscordIfNeeded() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path !== '/discord') return false
  window.location.replace(DISCORD_INVITE)
  return true
}

if (!redirectDiscordIfNeeded()) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
