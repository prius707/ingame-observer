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
import { PERSON_JSON_LD_TEXT } from './siteMeta'

function injectPersonJsonLd() {
  if (document.querySelector('script[data-person-jsonld]')) return
  const el = document.createElement('script')
  el.type = 'application/ld+json'
  el.dataset.personJsonld = '1'
  el.text = PERSON_JSON_LD_TEXT
  document.head.appendChild(el)
}

injectPersonJsonLd()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
