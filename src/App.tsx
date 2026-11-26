import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  DEFAULT_PITCH,
  PAGE_LINKS,
  PAGE_TITLES,
  PITCHES,
  SITE,
  SOCIAL,
} from './data'
import { BOOKING, PAGE_DESCRIPTIONS, clipPageMeta } from './siteMeta'
import { CLIPS, clipIndexFromSlug, parseClipSlugFromLocation } from './clips'
import {
  assetPath,
  canonicalForView,
  pathForView,
  viewFromLocation,
  type View,
} from './paths'
import { parseSavedPitch } from './sliderPos'
import { CvPage } from './pages/CvPage'
import { ClipsPage } from './pages/ClipsPage'
import { EventsPage } from './pages/EventsPage'
import { ContactPage } from './pages/ContactPage'
import { PrivacyNotice } from './pages/PrivacyNotice'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

const STORAGE_KEY = 'priusSliderPos'
const TALLEST_PITCH = PITCHES.reduce((a, b) => (a.weight >= b.weight ? a : b))

function readInitialView(): View {
  return viewFromLocation()
}

function setMeta(selector: string, attr: string, value: string) {
  const el = document.querySelector<HTMLMetaElement>(selector)
  if (el) el.setAttribute(attr, value)
}

function setDocumentMeta(view: View, clipSlug?: string | null) {
  const clipIndex = view === 'clips' ? clipIndexFromSlug(clipSlug) : -1
  const clip = clipIndex >= 0 ? CLIPS[clipIndex] : null
  const { title, description } = clip
    ? clipPageMeta(clip)
    : { title: PAGE_TITLES[view], description: PAGE_DESCRIPTIONS[view] }

  document.title = title
  const canonical = canonicalForView(view, clip?.slug ?? clipSlug)
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = canonical
  setMeta('meta[name="description"]', 'content', description)
  setMeta('meta[property="og:url"]', 'content', canonical)
  setMeta('meta[property="og:title"]', 'content', title)
  setMeta('meta[property="og:description"]', 'content', description)
  setMeta('meta[name="twitter:title"]', 'content', title)
  setMeta('meta[name="twitter:description"]', 'content', description)
}

function App() {
  const [view, setView] = useState<View>(readInitialView)
  const [pos, setPos] = useState(() => {
    try {
      const n = parseSavedPitch(sessionStorage.getItem(STORAGE_KEY), PITCHES.length)
      if (n != null) return n
    } catch {
      /* private mode / blocked storage */
    }
    return DEFAULT_PITCH
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [invert, setInvert] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [narrow, setNarrow] = useState(() =>
    window.matchMedia('(max-width: 720px)').matches,
  )
  const max = PITCHES.length - 1
  const pitch = PITCHES[pos]
  const heat = pos / max
  const hardMode = heat > 0.85
  const flashMode = pos === max && !reduceMotion && !narrow
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const didNavRef = useRef(false)
  const drawerId = useId()

  const handleClipChange = useCallback((slug: string) => {
    setDocumentMeta('clips', slug)
  }, [])

  const updatePos = useCallback(
    (next: number) => {
      setPos((prev) => {
        const clamped = Math.max(0, Math.min(next, max))
        // Require pausing on the warning step before jumping straight into flash mode.
        if (
          clamped === max &&
          prev < max - 1 &&
          !reduceMotion &&
          !narrow
        ) {
          return max - 1
        }
        return clamped
      })
    },
    [max, reduceMotion, narrow],
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)')
    const onChange = () => setNarrow(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!narrow) setMenuOpen(false)
  }, [narrow])

  useEffect(() => {
    const slug = view === 'clips' ? parseClipSlugFromLocation() : null
    setDocumentMeta(view, slug)
  }, [view])

  useEffect(() => {
    const onNav = () => {
      setView(readInitialView())
      setMenuOpen(false)
    }
    window.addEventListener('hashchange', onNav)
    window.addEventListener('popstate', onNav)
    return () => {
      window.removeEventListener('hashchange', onNav)
      window.removeEventListener('popstate', onNav)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const main = document.getElementById('main')
    main?.scrollTo?.(0, 0)
    if (!didNavRef.current) {
      didNavRef.current = true
      return
    }
    main?.focus()
  }, [view])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, String(pos))
    } catch {
      /* ignore */
    }
  }, [pos])

  useEffect(() => {
    if (!flashMode || menuOpen || view !== 'home') {
      setInvert(false)
      return
    }
    setInvert(true)
    const id = window.setInterval(() => setInvert((v) => !v), 340)
    return () => window.clearInterval(id)
  }, [flashMode, menuOpen, view])

  useEffect(() => {
    document.body.classList.toggle('invert', invert)
    return () => document.body.classList.remove('invert')
  }, [invert])

  useEffect(() => {
    document.body.classList.toggle(
      'hard-mode',
      hardMode && !flashMode && view === 'home' && !reduceMotion,
    )
    return () => document.body.classList.remove('hard-mode')
  }, [hardMode, flashMode, view, reduceMotion])

  useEffect(() => {
    if (menuOpen) setInvert(false)
  }, [menuOpen])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const drawer = document.getElementById(drawerId)
    const first = drawer?.querySelector<HTMLElement>('a[href], button')
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        return
      }
      if (e.key !== 'Tab' || !drawer) return
      const nodes = [
        menuToggleRef.current,
        ...drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      ].filter((el): el is HTMLElement => Boolean(el))
      if (nodes.length === 0) return
      const firstNode = nodes[0]
      const lastNode = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === firstNode) {
        e.preventDefault()
        lastNode.focus()
      } else if (!e.shiftKey && document.activeElement === lastNode) {
        e.preventDefault()
        firstNode.focus()
      }
    }
    const toggle = menuToggleRef.current
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      toggle?.focus()
    }
  }, [menuOpen, drawerId])

  useEffect(() => {
    if (view !== 'home' || menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target
      if (
        t instanceof HTMLElement &&
        (t.closest('input, textarea, select, [contenteditable="true"]') ||
          t.isContentEditable)
      ) {
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setPos((p) => Math.min(p + 1, max))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setPos((p) => Math.max(p - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, menuOpen, max])

  const goHome = useCallback(() => {
    setMenuOpen(false)
    setView('home')
    if (window.location.pathname !== '/' || window.location.hash !== '') {
      history.pushState(null, '', '/')
    }
  }, [])

  const goView = useCallback((next: Exclude<View, 'notfound'>) => {
    setMenuOpen(false)
    setView(next)
    const target = pathForView(next)
    if (window.location.pathname !== target || window.location.hash !== '') {
      history.pushState(null, '', target)
    }
  }, [])

  const onMenuNav = (href: string) => {
    if (href === '/privacy' || href === '#privacy') goView('privacy')
    else if (href === '/contact' || href === '#contact') goView('contact')
    else if (href === '/cv' || href === '#cv') goView('cv')
    else if (href === '/clips' || href === '#clips') goView('clips')
    else if (href === '/events' || href === '#events' || href === '#awards') {
      goView('events')
    } else setMenuOpen(false)
  }

  const pageClass =
    view === 'notfound'
      ? 'home--page home--notfound'
      : view === 'privacy' || view === 'contact'
        ? 'home--page'
        : view === 'cv'
          ? 'home--page home--cv'
          : view === 'clips'
            ? 'home--page home--clips'
            : view === 'events'
              ? 'home--page home--events'
              : ''
  const homeClass = ['home', pageClass].filter(Boolean).join(' ')

  return (
    <div className={homeClass}>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          const main = document.getElementById('main')
          main?.focus()
          main?.scrollIntoView({ behavior: 'auto', block: 'start' })
        }}
      >
        Skip to content
      </a>

      <header className={`header-main${menuOpen ? ' js--open' : ''}`}>
        <h1 className="site-title">
          <a
            href={assetPath('')}
            onClick={(e) => {
              e.preventDefault()
              goHome()
            }}
          >
            prius
          </a>
        </h1>
        <div className="header-actions">
          <nav className="header-nav" aria-label="Site">
            {PAGE_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={view === link.href.slice(1) ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  onMenuNav(link.href)
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            className="header-contact"
            href={SOCIAL.mailto}
            aria-label={BOOKING.aria}
          >
            {BOOKING.label}
          </a>
          <button
            ref={menuToggleRef}
            type="button"
            className={`menu-toggle menu-open${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={drawerId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? '×' : 'Menu'}
          </button>
        </div>
        {menuOpen && (
          <div
            className="menu-backdrop"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
        )}
        <div
          id={drawerId}
          className={`menu-drawer${menuOpen ? ' is-open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          {...(menuOpen ? {} : { hidden: true, inert: true })}
        >
          <div className="menu-drawer_inner">
            <nav className="menu" aria-label="Pages">
              <ul>
                {PAGE_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="menu-link"
                      aria-current={
                        view === link.href.slice(1) ? 'page' : undefined
                      }
                      onClick={(e) => {
                        e.preventDefault()
                        onMenuNav(link.href)
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="menu-meta">
              <p className="menu-booking">{SITE.availability}</p>
              <address className="menu-address">
                {SOCIAL.location}
                <br />
                <a href={SOCIAL.mailto}>{SOCIAL.email}</a>
              </address>
              <div className="menu-socials">
                <a
                  className="social-link"
                  href={SOCIAL.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="social-icon"
                    src={assetPath('icons/icon-twitter.svg')}
                    alt="X"
                    width={36}
                    height={36}
                  />
                </a>
                <a
                  className="social-link"
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="social-icon"
                    src={assetPath('icons/icon-linkedin.svg')}
                    alt="LinkedIn"
                    width={36}
                    height={36}
                  />
                </a>
                <a
                  className="social-link"
                  href={SOCIAL.liquipedia}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="social-icon"
                    src={assetPath('icons/icon-liquipedia-mark.svg')}
                    alt="Liquipedia"
                    width={36}
                    height={36}
                  />
                </a>
              </div>
              <p className="menu-legal">
                <a
                  className="menu-privacy-link"
                  href="/privacy"
                  onClick={(e) => {
                    e.preventDefault()
                    onMenuNav('/privacy')
                  }}
                >
                  Privacy
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="wrapper" tabIndex={-1}>
        {view === 'privacy' ? (
          <PrivacyNotice
            storageKey={STORAGE_KEY}
            onBack={goHome}
            onGo={goView}
          />
        ) : view === 'contact' ? (
          <ContactPage onBack={goHome} onGo={goView} />
        ) : view === 'cv' ? (
          <CvPage onBack={goHome} onGo={goView} />
        ) : view === 'clips' ? (
          <ClipsPage
            onBack={goHome}
            onGo={goView}
            onClipChange={handleClipChange}
          />
        ) : view === 'events' ? (
          <EventsPage
            onBack={goHome}
            onGo={goView}
            reduceMotion={reduceMotion}
          />
        ) : view === 'notfound' ? (
          <NotFoundPage onBack={goHome} onGo={goView} />
        ) : (
          <div className="content-block">
            <div className="content-block__inner">
              <div
                id="output"
                className={hardMode ? 'is-hot' : undefined}
                aria-live="polite"
              >
                <p className="size-guide" aria-hidden="true">
                  {TALLEST_PITCH.content}
                </p>
                <span key={pos}>{pitch.content}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {view === 'home' && heat > 0.72 && (
        <div className="fx" aria-hidden="true">
          <div className={`stamp stamp-a${heat > 0.88 ? ' is-on' : ''}`}>
            BOOK ME
          </div>
          <div className={`stamp stamp-b${heat > 0.92 ? ' is-on' : ''}`}>
            ACT NOW
          </div>
          <div className={`stamp stamp-c${pos === max ? ' is-on' : ''}`}>
            @priusOBS
          </div>
        </div>
      )}

      {view === 'home' && heat > 0.78 && !reduceMotion ? (
        <div className="tactibear" aria-hidden="true">
          <img
            src={assetPath('mascot/tactibear.webp')}
            alt=""
            width={220}
            height={207}
            decoding="async"
          />
        </div>
      ) : null}

      {view === 'home' &&
      pos >= max - 2 &&
      pos < max &&
      !reduceMotion &&
      !narrow ? (
        <p className="epilepsy-warn" role="status">
          {pos === max - 1
            ? 'Photosensitivity warning: the next step flashes black & white.'
            : 'Photosensitivity warning: max hard sell flashes black & white.'}
        </p>
      ) : null}

      {view === 'home' && (
        <div className="slider-wrap">
          <p className="home-tagline">
            {SITE.taglineRole}
            {' · '}
            <span className="home-tagline__lock">{SITE.taglineCreds}</span>
          </p>
          <p className="home-book">
            <a href={SOCIAL.mailto} aria-label={BOOKING.aria}>
              {BOOKING.longLabel}
            </a>
            <span aria-hidden="true"> · </span>
            <span>{SITE.availability}</span>
          </p>
          <div className="slider__scale" aria-hidden="true">
            <span>Less Hard Sell</span>
            <span>More Hard Sell</span>
          </div>
          <label className="sr-only" htmlFor="slider">
            Hard sell intensity
          </label>
          <input
            id="slider"
            type="range"
            min={0}
            max={max}
            step={1}
            value={pos}
            style={{ ['--_p' as string]: `${(pos / max) * 100}%` }}
            aria-valuetext={
              pos < max * 0.33
                ? 'Soft sell'
                : pos < max * 0.66
                  ? 'Balanced'
                  : 'Hard sell'
            }
            onChange={(e) => updatePos(Number(e.target.value))}
          />
          <p className="site-credit">
            Inspiration taken from getcoleman.com
          </p>
        </div>
      )}
    </div>
  )
}

export default App
