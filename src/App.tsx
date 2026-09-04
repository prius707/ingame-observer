import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  CONTROLLER_EMAIL,
  CV_SECTIONS,
  DEFAULT_PITCH,
  PAGE_LINKS,
  PAGE_TITLES,
  PITCHES,
  SITE,
  SITE_TAGLINE,
  SOCIAL,
} from './data'
import { BOOKING, PAGE_DESCRIPTIONS } from './siteMeta'
import {
  AMERICAS_FLICKR_CREDIT,
  AMERICAS_FLICKR_OWNER_URL,
  EVENT_YEARS,
  FLICKR_CREDIT,
  FLICKR_NOTE,
  FLICKR_OWNER_URL,
  eventTravelFlag,
  filterEventYears,
  type EventEntry,
  type EventGameFilter,
  type EventRangeFilter,
} from './events'
import { CV_QUOTES } from './quotes'
import {
  CLIPS,
  clipHash,
  clipIndexFromSlug,
  clipPageUrl,
  clipPoster,
  clipQuoteRepeatsTitle,
  clipSrc,
  parseClipSlugFromLocation,
} from './clips'
import { CHAT_LINES, emoteSrc, parseChatText } from './chatLines'
import {
  assetPath,
  canonicalForView,
  clipPath,
  pathForView,
  usesClipHash,
  viewFromLocation,
  type View,
} from './paths'
import './App.css'

const STORAGE_KEY = 'priusSliderPos'
const SECURITY_TXT = '/.well-known/security.txt'

function readInitialView(): View {
  return viewFromLocation()
}

function setMeta(
  selector: string,
  attr: string,
  value: string,
) {
  const el = document.querySelector<HTMLMetaElement>(selector)
  if (el) el.setAttribute(attr, value)
}

function setDocumentMeta(view: View, clipSlug?: string | null) {
  const title = PAGE_TITLES[view]
  const description = PAGE_DESCRIPTIONS[view]
  document.title = title
  const canonical = canonicalForView(view, clipSlug)
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
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved != null) {
        const n = Number(saved)
        if (!Number.isNaN(n) && n >= 0 && n < PITCHES.length) return n
      }
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
  const sizeGuideRef = useRef<HTMLParagraphElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const didNavRef = useRef(false)
  const drawerId = useId()

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
    const id = window.setInterval(() => setInvert((v) => !v), 280)
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
  }, [hardMode, flashMode, view, reduceMotion])

  useEffect(() => {
    if (menuOpen) setInvert(false)
  }, [menuOpen])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
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

  const goHome = () => {
    setMenuOpen(false)
    setView('home')
    history.pushState(null, '', '/')
  }

  const goView = (next: View) => {
    setMenuOpen(false)
    if (next === 'notfound') return
    setView(next)
    history.pushState(null, '', pathForView(next))
  }

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
      <a className="skip-link" href="#main">
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
          <button
            type="button"
            className="menu-backdrop"
            aria-label="Close menu"
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
          <PrivacyNotice onBack={goHome} onGo={goView} />
        ) : view === 'contact' ? (
          <ContactPage onBack={goHome} />
        ) : view === 'cv' ? (
          <CvPage onBack={goHome} />
        ) : view === 'clips' ? (
          <ClipsPage onBack={goHome} />
        ) : view === 'events' ? (
          <EventsPage onBack={goHome} reduceMotion={reduceMotion} />
        ) : view === 'notfound' ? (
          <NotFoundPage onBack={goHome} onGo={goView} />
        ) : (
          <div className="content-block">
            <div className="content-block__inner">
              <div
                id="output"
                className={hardMode ? 'is-hot' : undefined}
                style={{ minHeight: sizeGuideRef.current?.offsetHeight }}
                aria-live="polite"
              >
                <p className="size-guide" ref={sizeGuideRef} aria-hidden="true">
                  {
                    PITCHES.reduce((a, b) => (a.weight >= b.weight ? a : b))
                      .content
                  }
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
            key={heat > 0.78 ? 'squish-on' : 'squish-off'}
            src={assetPath('mascot/tactibear.webp')}
            alt=""
            width={220}
            height={207}
            decoding="async"
          />
        </div>
      ) : null}

      {view === 'home' &&
      pos === max - 1 &&
      !reduceMotion &&
      !narrow ? (
        <p className="epilepsy-warn" role="status">
          Photosensitivity warning: the next step flashes black &amp; white.
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
            onChange={(e) => setPos(Number(e.target.value))}
          />
          <p className="site-credit">
            Inspiration taken from getcoleman.com
          </p>
        </div>
      )}
    </div>
  )
}

function PageFooter() {
  return (
    <footer className="page-footer">
      <p className="page-footer__name">{SITE.legalName}</p>
      <p className="page-footer__availability">{SITE.availability}</p>
      <p className="page-footer__book">
        <a href={SOCIAL.mailto} aria-label={BOOKING.aria}>
          {BOOKING.longLabel}
        </a>
      </p>
      <p className="page-footer__contact">
        <a href={SOCIAL.mailto}>{SOCIAL.email}</a>
        {' · '}
        <a
          href={SOCIAL.twitter}
          target="_blank"
          rel="noopener noreferrer"
        >
          @priusOBS
        </a>
        {' · '}
        <a href="/privacy">Privacy</a>
        {' · '}
        <a href={SECURITY_TXT}>security.txt</a>
      </p>
    </footer>
  )
}

function CvPage({ onBack }: { onBack: () => void }) {
  return (
    <article className="cv-page">
      <h2 className="sr-only">CV</h2>
      <p className="cv-name">{SITE.legalName}</p>
      <p className="cv-lead">{SITE_TAGLINE}</p>
      <p className="cv-positioning">{SITE.positioning}</p>
      <p className="cv-availability">
        {SITE.availability}
        {' · '}
        <a href={SOCIAL.mailto} aria-label={BOOKING.aria}>
          {BOOKING.longLabel}
        </a>
      </p>

      <div className="cv-quotes">
        {CV_QUOTES.map((q) => (
          <blockquote key={q.text.slice(0, 32)} className="cv-quote">
            <p>&ldquo;{q.text}&rdquo;</p>
            <footer>{q.attribution}</footer>
          </blockquote>
        ))}
      </div>

      <div className="cv-body">
        {CV_SECTIONS.map((section) => (
          <section key={section.title} className="cv-section">
            <h3>{section.title}</h3>
            {section.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </section>
        ))}
      </div>

      <p className="cv-print">
        <button
          type="button"
          className="text-btn"
          onClick={() => window.print()}
        >
          Print / save as PDF
        </button>
      </p>

      <PageFooter />

      <p className="page-back">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
      </p>
    </article>
  )
}

function ChatTicker() {
  // Duplicate for a seamless CSS marquee loop.
  const loop = [...CHAT_LINES, ...CHAT_LINES]

  return (
    <aside className="chat-ticker" aria-label="Curated watch-party chat">
      <p className="chat-ticker__label">Chat</p>
      <div className="chat-ticker__viewport">
        <ul className="chat-ticker__track">
          {loop.map((line, i) => (
            <li key={`${line.user}-${i}`} className="chat-ticker__line">
              <span className="chat-ticker__user" style={{ color: line.color }}>
                {line.user}
              </span>
              <span className="chat-ticker__text">
                {parseChatText(line.text).map((part, j) =>
                  part.type === 'emote' ? (
                    <img
                      key={j}
                      className="chat-ticker__emote"
                      src={emoteSrc(part.name)}
                      alt={part.name}
                      title={part.name}
                      width={28}
                      height={28}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span key={j}>{part.value}</span>
                  ),
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

const CLIP_DEFAULT_VOLUME = 0.3

function ClipsPage({ onBack }: { onBack: () => void }) {
  const initialSlug = parseClipSlugFromLocation()
  const initialIndex = clipIndexFromSlug(initialSlug)
  const [index, setIndex] = useState(initialIndex >= 0 ? initialIndex : 0)
  const [shouldPlay, setShouldPlay] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stripRef = useRef<HTMLUListElement>(null)
  const clip = CLIPS[index]
  const total = CLIPS.length

  const select = useCallback((i: number, play = true) => {
    const next = ((i % total) + total) % total
    setIndex(next)
    setShouldPlay(play)
    const slug = CLIPS[next].slug
    if (usesClipHash()) {
      const nextHash = clipHash(slug)
      if (window.location.hash !== nextHash) {
        history.replaceState(null, '', nextHash)
      }
    } else {
      const nextPath = clipPath(slug)
      if (window.location.pathname !== nextPath) {
        history.replaceState(null, '', nextPath)
      }
    }
  }, [total])

  const pickRandom = () => {
    if (total <= 1) return
    let next = index
    while (next === index) {
      next = Math.floor(Math.random() * total)
    }
    select(next)
  }

  function applyDefaultVolume(el: HTMLVideoElement | null) {
    if (!el) return
    el.volume = CLIP_DEFAULT_VOLUME
  }

  useEffect(() => {
    const slug = CLIPS[index].slug
    if (usesClipHash()) {
      if (!window.location.hash.startsWith('#clips/')) {
        history.replaceState(null, '', clipHash(slug))
      }
      return
    }
    if (
      window.location.pathname === '/clips' ||
      window.location.pathname === '/clips/'
    ) {
      history.replaceState(null, '', clipPath(slug))
    }
  }, [])

  useEffect(() => {
    const onHash = () => {
      const slug = parseClipSlugFromLocation()
      const i = clipIndexFromSlug(slug)
      if (i >= 0) {
        setIndex(i)
        setShouldPlay(false)
      }
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('popstate', onHash)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('popstate', onHash)
    }
  }, [])

  useEffect(() => {
    const el = videoRef.current
    applyDefaultVolume(el)
    if (!el) return
    el.setAttribute('controlsList', 'nodownload noremoteplayback')
    try {
      el.disablePictureInPicture = true
    } catch {
      /* older browsers */
    }
  }, [index])

  useEffect(() => {
    const el = videoRef.current
    if (!el || !shouldPlay) return
    applyDefaultVolume(el)
    void el.play().catch(() => {
      /* autoplay blocked until gesture — controls still work */
    })
  }, [index, shouldPlay])

  useEffect(() => {
    const activeBtn = stripRef.current?.querySelector<HTMLElement>('[aria-current="true"]')
    activeBtn?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
  }, [index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.body.classList.contains('menu-open')) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target
      if (
        target instanceof HTMLElement &&
        (target.closest('input, textarea, select, [contenteditable="true"]') ||
          target.isContentEditable)
      ) {
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        select(index + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        select(index - 1)
      }
    }
    // Capture so ←/→ still change clips when the video is focused (not seek).
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [index, select])
  return (
    <article className="clips-page">
      <header className="clips-header">
        <h2>Clips</h2>
        <p className="clips-lead">
          Casters and co-streams roasting my camera work — included because
          observing is a live craft.
        </p>
        <p className="clips-keys">
          <span className="clips-keys__hint">← → or ↑ ↓ to change clip</span>
          <button
            type="button"
            className="text-btn clips-keys__random"
            onClick={pickRandom}
          >
            Random clip
          </button>
        </p>
      </header>

      <div className="clips-viewer">
        <div className="clip-stage">
          <video
            ref={videoRef}
            key={clip.file}
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            playsInline
            preload="metadata"
            poster={clipPoster(clip.file)}
            src={clipSrc(clip.file)}
            aria-label={clip.title}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onLoadedMetadata={(e) => applyDefaultVolume(e.currentTarget)}
            onEnded={() => select(index + 1)}
          />
        </div>

        <div className="clip-now">
          <div className="clip-now__top">
            <p className="clip-now__count">
              {index + 1} / {total}
            </p>
            <div className="clip-now__nav">
              <button
                type="button"
                className="clip-nav-btn"
                onClick={() => select(index - 1)}
                aria-label="Previous clip"
              >
                ←
              </button>
              <button
                type="button"
                className="clip-nav-btn"
                onClick={() => select(index + 1)}
                aria-label="Next clip"
              >
                →
              </button>
            </div>
          </div>
          <h3 className="clip-now__title">{clip.title}</h3>
          <p className="clip-note">{clip.note}</p>
          {clipQuoteRepeatsTitle(clip) ? null : (
            <blockquote className="clip-quote">
              <p>&ldquo;{clip.quote}&rdquo;</p>
            </blockquote>
          )}
          <p className="clip-original">
            <a
              href={clipPageUrl(clip.slug)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open original on Twitch
            </a>
          </p>
        </div>
      </div>

      <ChatTicker />

      <ul
        ref={stripRef}
        className="clips-strip"
        aria-label="Clip playlist"
      >
        {CLIPS.map((item, i) => {
          const active = i === index
          return (
            <li key={item.slug}>
              <button
                type="button"
                className={`clips-strip__item${active ? ' is-active' : ''}`}
                onClick={() => select(i)}
                aria-current={active ? 'true' : undefined}
              >
                <img
                  src={clipPoster(item.file)}
                  alt=""
                  width={160}
                  height={90}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <span className="clips-strip__title">{item.title}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <PageFooter />

      <p className="page-back">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
      </p>
    </article>
  )
}

function EventsPage({
  onBack,
  reduceMotion,
}: {
  onBack: () => void
  reduceMotion: boolean
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [emmyOnly, setEmmyOnly] = useState(false)
  const [game, setGame] = useState<EventGameFilter>('all')
  const [range, setRange] = useState<EventRangeFilter>('recent')

  const filtered = filterEventYears(EVENT_YEARS, { game, range, emmyOnly })
  const empty = filtered.length === 0

  return (
    <article className="events-page">
      <header className="events-header">
        <h2>Events</h2>
        <p className="events-hint">Tap or hover an event to view the still</p>
        <div className="events-toolbar">
          <div className="events-filters" role="group" aria-label="Game">
            {(
              [
                ['all', 'All games'],
                ['VALORANT', 'VALORANT'],
                ['CS', 'Counter-Strike'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`events-chip${game === value ? ' is-on' : ''}`}
                aria-pressed={game === value}
                onClick={() => setGame(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="events-filters" role="group" aria-label="Years">
            <button
              type="button"
              className={`events-chip${range === 'recent' ? ' is-on' : ''}`}
              aria-pressed={range === 'recent'}
              onClick={() => setRange('recent')}
            >
              Last 24 months
            </button>
            <button
              type="button"
              className={`events-chip${range === 'all' ? ' is-on' : ''}`}
              aria-pressed={range === 'all'}
              onClick={() => setRange('all')}
            >
              All years
            </button>
          </div>
          <label className="events-filter">
            <input
              type="checkbox"
              checked={emmyOnly}
              onChange={(e) => setEmmyOnly(e.target.checked)}
            />
            Sports Emmy only
          </label>
        </div>
      </header>

      {empty ? (
        <p className="events-empty">
          Nothing in this cut.{' '}
          {range === 'recent' ? (
            <button
              type="button"
              className="text-btn"
              onClick={() => setRange('all')}
            >
              Show all years
            </button>
          ) : game !== 'all' ? (
            <button
              type="button"
              className="text-btn"
              onClick={() => setGame('all')}
            >
              Show all games
            </button>
          ) : (
            <button
              type="button"
              className="text-btn"
              onClick={() => setEmmyOnly(false)}
            >
              Clear Emmy filter
            </button>
          )}
        </p>
      ) : null}

      {filtered.map((group) => (
        <section key={group.year} id={`events-year-${group.year}`} className="year">
          <h3>{group.year}</h3>
          {group.events.map((event) => (
            <EventRow
              key={`${group.year}-${event.name}`}
              event={event}
              year={group.year}
              active={activeId === `${group.year}-${event.name}`}
              inlinePhoto={reduceMotion}
              onActivate={() =>
                setActiveId(`${group.year}-${event.name}`)
              }
              onDeactivate={() =>
                setActiveId((id) =>
                  id === `${group.year}-${event.name}` ? null : id,
                )
              }
            />
          ))}
        </section>
      ))}

      <footer className="events-credit">
        <p>
          VALORANT stills credited to{' '}
          <a href={FLICKR_OWNER_URL} target="_blank" rel="noopener noreferrer">
            {FLICKR_CREDIT}
          </a>
          ; Americas league to{' '}
          <a
            href={AMERICAS_FLICKR_OWNER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {AMERICAS_FLICKR_CREDIT}
          </a>
          . CS / other events use organizer albums where we have them — check
          each credit. Files are hosted here; links go to the originals.
        </p>
        <p className="events-credit-note">{FLICKR_NOTE}</p>
      </footer>

      <PageFooter />

      <p className="page-back">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
      </p>
    </article>
  )
}

function EventRow({
  event,
  year,
  active,
  inlinePhoto,
  onActivate,
  onDeactivate,
}: {
  event: EventEntry
  year: number
  active: boolean
  inlinePhoto: boolean
  onActivate: () => void
  onDeactivate: () => void
}) {
  const hasPhoto = Boolean(event.photo?.imageUrl)
  const label = event.game === 'CS' ? `${event.name} (CS)` : event.name
  const flag = eventTravelFlag(event.name, year)
  const emmyLabel =
    event.emmy === 'winner'
      ? event.emmyAwardYear
        ? `Sports Emmy Winner · ${event.emmyAwardYear}`
        : 'Sports Emmy Winner'
      : event.emmy === 'nominated'
        ? 'Emmy Nominated'
        : null
  const photoCredit =
    event.photo?.credit ||
    (event.photo?.pageUrl.includes('vctamericas')
      ? AMERICAS_FLICKR_CREDIT
      : event.photo?.pageUrl.includes('eslgaming.com') ||
          event.photo?.pageUrl.includes('smugmug.com')
        ? 'ESL FACEIT Group'
        : event.photo?.pageUrl.includes('blast')
          ? 'BLAST Esports'
          : FLICKR_CREDIT)

  return (
    <div className={`award${active && hasPhoto ? ' is-active' : ''}`}>
      <figure
        className={active && hasPhoto ? 'js-active' : undefined}
        onMouseEnter={() => {
          if (hasPhoto) onActivate()
        }}
        onMouseLeave={() => {
          if (hasPhoto) onDeactivate()
        }}
      >
        <figcaption>
          {hasPhoto ? (
            <button
              type="button"
              className="award-name"
              onClick={(e) => {
                e.preventDefault()
                if (active) onDeactivate()
                else onActivate()
              }}
              onFocus={() => onActivate()}
              aria-pressed={active}
            >
              {label}
              {flag ? (
                <span className="award-flag" title="Event location" aria-hidden="true">
                  {flag}
                </span>
              ) : null}
              {emmyLabel ? (
                <span className={`award-emmy award-emmy--${event.emmy}`}>
                  {emmyLabel}
                </span>
              ) : null}
            </button>
          ) : (
            <span className="award-name award-name--static">
              {label}
              {flag ? (
                <span className="award-flag" title="Event location" aria-hidden="true">
                  {flag}
                </span>
              ) : null}
              {emmyLabel ? (
                <span className={`award-emmy award-emmy--${event.emmy}`}>
                  {emmyLabel}
                </span>
              ) : null}
            </span>
          )}
        </figcaption>
        {active && event.photo?.imageUrl ? (
          <img
            className={inlinePhoto ? 'award-inline-photo' : undefined}
            src={
              event.photo.imageUrl.startsWith('http')
                ? event.photo.imageUrl
                : assetPath(event.photo.imageUrl)
            }
            alt={event.photo.title || `${event.name} still`}
            decoding="async"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : null}
      </figure>
      {active && event.photo && inlinePhoto ? (
        <p className="award-inline-credit">
          <a
            href={event.photo.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {event.photo.title || 'Flickr photo'}
          </a>
          <span>
            {event.photo.license} · {photoCredit}
          </span>
        </p>
      ) : null}
      {active && event.photo && !inlinePhoto ? (
        <p className="award-photo-credit">
          <a
            className="award-photo-credit__title"
            href={event.photo.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {event.photo.title || 'Flickr photo'}
          </a>
          <span className="award-photo-credit__copy">
            {event.photo.license} · {photoCredit}
          </span>
        </p>
      ) : null}
    </div>
  )
}

function NotFoundPage({
  onBack,
  onGo,
}: {
  onBack: () => void
  onGo: (next: Exclude<View, 'notfound'>) => void
}) {
  return (
    <article className="not-found">
      <header className="not-found__intro">
        <p className="not-found__code">404</p>
        <h2 className="not-found__title">Missed the play.</h2>
        <p className="not-found__lead">
          This URL isn&rsquo;t on the broadcast. Prius is observing a different
          map.
        </p>
      </header>
      <figure className="not-found__clip">
        <img
          src={assetPath('404/s1mple-1v2.jpg')}
          alt="s1mple winning a 1v2 clutch"
          width={420}
          height={237}
          decoding="async"
          fetchPriority="high"
          draggable={false}
        />
      </figure>
      <nav className="not-found__recover" aria-label="Still on the site">
        <a
          href="/cv"
          onClick={(e) => {
            e.preventDefault()
            onGo('cv')
          }}
        >
          CV
        </a>
        <a
          href="/clips"
          onClick={(e) => {
            e.preventDefault()
            onGo('clips')
          }}
        >
          Clips
        </a>
        <a
          href="/events"
          onClick={(e) => {
            e.preventDefault()
            onGo('events')
          }}
        >
          Events
        </a>
        <a href={SOCIAL.mailto} aria-label={BOOKING.aria}>
          {BOOKING.longLabel}
        </a>
      </nav>
      <p className="page-back">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
      </p>
    </article>
  )
}

function ContactPage({ onBack }: { onBack: () => void }) {
  return (
    <article className="contact-page">
      <h2>Book observing</h2>
      <p className="contact-lead">{SITE.positioning}</p>
      <p className="contact-availability">{SITE.availability}</p>
      <p className="contact-place">{SOCIAL.location}</p>
      <p className="contact-mail">
        <a href={SOCIAL.mailto} aria-label={BOOKING.aria}>
          {SOCIAL.email}
        </a>
      </p>
      <p className="contact-hint">
        The mailto opens with Event and Dates fields. Same address if you write
        a new message.
      </p>
      <p className="contact-socials">
        <a href={SOCIAL.twitter} target="_blank" rel="noopener noreferrer">
          @priusOBS
        </a>
        {' · '}
        <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        {' · '}
        <a href={SOCIAL.liquipedia} target="_blank" rel="noopener noreferrer">
          Liquipedia
        </a>
      </p>
      <PageFooter />
      <p className="page-back">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
      </p>
    </article>
  )
}

function PrivacyNotice({
  onBack,
  onGo,
}: {
  onBack: () => void
  onGo: (next: Exclude<View, 'notfound'>) => void
}) {
  return (
    <article className="privacy">
      <h2>Privacy</h2>
      <p className="privacy-lead">
        Personal hiring site for David &ldquo;prius&rdquo; Kuntz. This page
        describes what actually happens when you use{' '}
        <a href="https://ingame.observer/">ingame.observer</a>. It is not a
        GDPR certificate and I am not claiming the site is &ldquo;fully
        compliant.&rdquo;
      </p>

      <h3>Who is responsible</h3>
      <p>
        Controller: David Kuntz (prius).
        <br />
        Contact:{' '}
        <a href={SOCIAL.mailto}>{CONTROLLER_EMAIL}</a>
        <br />
        Place of business: Los Angeles, California, United States.
      </p>

      <h3>What this site does not do</h3>
      <ul>
        <li>No accounts, logins, or newsletter signup.</li>
        <li>
          No analytics, advertising pixels, retargeting tags, or marketing
          cookies. Cloudflare Web Analytics is disabled on this hostname
          (confirmed 4 September 2026). Zaraz is off. I do not add a cookie
          wall because nothing here needs consent for cookies.
        </li>
        <li>
          Fonts are self-hosted. Your browser does not fetch Google Fonts from
          this site.
        </li>
        <li>
          Event photos and clip videos are served from this origin. Opening an
          event still does not call Flickr or Smugmug.
        </li>
        <li>
          No first-party cookies. The only client storage is tab-scoped{' '}
          <code>sessionStorage</code> for the slider (below).
        </li>
      </ul>

      <h3>Hosting and server logs</h3>
      <p>
        Visitors hit a Cloudflare proxy first. The origin is GitHub Pages,
        which is served from GitHub&rsquo;s own edge (Fastly). I do not run a
        separate application server or log store. Those hosts see ordinary
        connection data: IP address, user agent, referrer, requested URL, and
        timestamp. Retention follows each host&rsquo;s defaults.
      </p>
      <p>
        Cloudflare may also send Network Error Logging reports (connection
        failures) to its own endpoints. That is reliability telemetry, not
        analytics I turned on.
      </p>
      <p>
        Email Address Obfuscation (Cloudflare Scrape Shield) is on. If
        Cloudflare rewrites an address in HTML it may load a small{' '}
        <code>/cdn-cgi/</code> decode script. That is scrape protection, not
        a tracker. First-party pages put the booking address in after
        JavaScript, so that script often never appears.
      </p>
      <p>
        Provider notices:{' '}
        <a
          href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub privacy statement
        </a>
        {' · '}
        <a
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cloudflare privacy policy
        </a>
        .
      </p>

      <h3>Session storage</h3>
      <p>
        For this browser tab only, the site may store the hard-sell slider
        position (<code>{STORAGE_KEY}</code>). That stays on your device,
        isn&rsquo;t a cookie, and clears when the tab closes. Block storage
        and everything still works with defaults. Strictly necessary for
        remembering the slider in the current tab.
      </p>

      <h3>When you contact me</h3>
      <p>
        Book / email links use mailto:{' '}
        <a href={SOCIAL.mailto}>{CONTROLLER_EMAIL}</a>. That opens{' '}
        <em>your</em> mail client. I do not see the message until you send it.
        Your provider processes the outbound mail under their terms.
      </p>
      <p>
        Inbound mail to that address is handled by Cloudflare Email Routing
        and delivered to Gmail. I read it to reply about observing / booking
        (or security). I do not sell it.
      </p>
      <p>
        A DM on X goes through X under their terms. Same use: reply about
        work.
      </p>
      <p>
        Google&rsquo;s privacy policy:{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          policies.google.com/privacy
        </a>
        .
      </p>

      <h3>Legal bases</h3>
      <ul>
        <li>
          Hire inquiries (email / DMs): Art. 6(1)(b) GDPR — steps prior to a
          contract — and/or Art. 6(1)(f) legitimate interests in answering
          booking requests.
        </li>
        <li>
          Server logs and security: Art. 6(1)(f) — operating and protecting
          the site.
        </li>
      </ul>

      <h3>Retention</h3>
      <ul>
        <li>
          Host logs: Cloudflare&rsquo;s, GitHub&rsquo;s, and Fastly&rsquo;s
          defaults.
        </li>
        <li>
          Email: kept as long as needed to reply or book work, then according
          to my mailbox practice.
        </li>
        <li>
          Slider <code>sessionStorage</code>: until the tab closes.
        </li>
      </ul>

      <h3>Your rights</h3>
      <p>
        If GDPR or UK GDPR applies to you, you can ask for access,
        rectification, erasure, restriction, objection, or portability of
        personal data I hold, and you can withdraw consent if I ever relied
        on it (I am not using consent for a cookie wall today). Email{' '}
        <a href={SOCIAL.mailto}>{CONTROLLER_EMAIL}</a>. I may need enough
        detail to find your message.
      </p>
      <p>
        You can also complain to a supervisory authority in your EU/EEA
        country or, for the UK, the ICO. I do not name a &ldquo;lead&rdquo;
        authority — I am based in the US.
      </p>

      <h3>International transfers</h3>
      <p>
        Cloudflare, GitHub/Fastly, and Google/Gmail are US (and global)
        processors. Using this site or emailing me means data may be processed
        in the United States and other countries where those providers
        operate. They publish their own transfer tools (standard contractual
        clauses and similar terms). I am not listing certificate numbers I do
        not control.
      </p>

      <h3>Cookies and ePrivacy</h3>
      <p>
        No cookies anywhere on this origin. Slider memory is{' '}
        <code>sessionStorage</code> key <code>{STORAGE_KEY}</code> — tab
        scoped, not a cookie, strictly necessary for that UI. There is no
        cookie wall.
      </p>

      <h3>Photos &amp; clips</h3>
      <p>
        Event stills are local copies with credit links back to the original
        Flickr / ESL / organizer albums (Riot / VCT Americas / BLAST / etc.).
        Clips are local files with links to the Twitch originals. The chat
        ticker uses self-hosted 7TV emote frames, not a live Twitch feed.
        Rights stay with the photographers and organizers unless a source page
        says otherwise.
      </p>

      <h3>External links</h3>
      <p>
        Liquipedia, X, LinkedIn, Flickr, Twitch, mailto — once you leave,
        their rules apply.
      </p>

      <h3>Security</h3>
      <p>
        There is a basic CSP in the HTML (<code>script-src &apos;self&apos;</code>
        ). Keep it. Spotted something sketchy?{' '}
        <a href={SOCIAL.mailto}>{CONTROLLER_EMAIL}</a>
        {' · '}
        <a href={SECURITY_TXT}>security.txt</a>
      </p>

      <p className="privacy-updated">Last updated: 4 September 2026</p>

      <p>
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
        {' · '}
        <button
          type="button"
          className="text-btn"
          onClick={() => onGo('contact')}
        >
          Book observing
        </button>
      </p>
    </article>
  )
}

export default App
