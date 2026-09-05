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
import { PERSON_JSON_LD_TEXT } from './siteMeta'

/** /discord is a static redirect page; if the SPA still loads, bounce out. */
function redirectDiscordIfNeeded() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path !== '/discord') return false
  window.location.replace(DISCORD_INVITE)
  return true
}

function injectPersonJsonLd() {
  if (document.querySelector('script[data-person-jsonld]')) return
  const el = document.createElement('script')
  el.type = 'application/ld+json'
  el.dataset.personJsonld = '1'
  el.text = PERSON_JSON_LD_TEXT
  document.head.appendChild(el)
}

if (!redirectDiscordIfNeeded()) {
  injectPersonJsonLd()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
