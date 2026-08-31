import { useEffect, useId, useRef, useState } from 'react'
import {
  CONTROLLER_EMAIL,
  CV_SECTIONS,
  DEFAULT_PITCH,
  MENU_LINKS,
  PAGE_TITLES,
  PARTNERS,
  PITCHES,
  SITE,
  SITE_TAGLINE,
  SOCIAL,
} from './data'
import {
  AMERICAS_FLICKR_CREDIT,
  AMERICAS_FLICKR_OWNER_URL,
  EVENT_YEARS,
  FLICKR_CREDIT,
  FLICKR_NOTE,
  FLICKR_OWNER_URL,
  eventTravelFlag,
  type EventEntry,
} from './events'
import { CV_QUOTES } from './quotes'
import {
  CLIPS,
  clipHash,
  clipIndexFromSlug,
  clipPageUrl,
  clipPoster,
  clipSrc,
  parseClipSlugFromLocation,
} from './clips'
import { CHAT_LINES, emoteSrc, parseChatText } from './chatLines'
import { assetPath } from './paths'
import './App.css'

const STORAGE_KEY = 'priusSliderPos'
const PAGE_DARK_KEY = 'priusPageDark'

type View = 'home' | 'privacy' | 'cv' | 'events' | 'clips' | 'notfound'

function isRootPath(pathname = window.location.pathname) {
  return pathname === '/' || pathname === '' || pathname === '/index.html'
}

function readInitialView(): View {
  if (!isRootPath()) return 'notfound'
  const h = window.location.hash
  if (h === '#privacy') return 'privacy'
  if (h === '#cv') return 'cv'
  if (h === '#clips' || h.startsWith('#clips/')) return 'clips'
  if (h === '#events' || h === '#awards') return 'events'
  return 'home'
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
  const [pageDark, setPageDark] = useState(() => {
    try {
      return sessionStorage.getItem(PAGE_DARK_KEY) === '1'
    } catch {
      return false
    }
  })
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
    document.title = PAGE_TITLES[view]
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
    document.getElementById('main')?.scrollTo?.(0, 0)
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
    try {
      sessionStorage.setItem(PAGE_DARK_KEY, pageDark ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [pageDark])

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const goHome = () => {
    setMenuOpen(false)
    if (!isRootPath()) {
      window.location.assign('/')
      return
    }
    setView('home')
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  const goHash = (hash: View) => {
    const fragment =
      hash === 'home' || hash === 'notfound'
        ? ''
        : hash === 'events'
          ? 'events'
          : hash
    if (!isRootPath()) {
      window.location.assign(fragment ? `/#${fragment}` : '/')
      return
    }
    setView(hash)
    if (fragment) window.location.hash = fragment
    else if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    setMenuOpen(false)
  }

  const onMenuNav = (href: string) => {
    if (href === '#privacy') goHash('privacy')
    else if (href === '#cv') goHash('cv')
    else if (href === '#clips') goHash('clips')
    else if (href === '#awards' || href === '#events') goHash('events')
    else setMenuOpen(false)
  }

  const pageClass =
    view === 'notfound'
      ? 'home--page home--notfound'
      : view === 'privacy'
        ? 'home--page'
        : view === 'cv'
          ? 'home--page home--cv'
          : view === 'clips'
            ? 'home--page home--clips'
            : view === 'events'
              ? 'home--page home--events'
              : ''
  const showPageTheme = view !== 'home'
  const homeClass = [
    'home',
    pageClass,
    showPageTheme && pageDark ? 'home--dark' : '',
  ]
    .filter(Boolean)
    .join(' ')

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
          <a className="header-contact" href={SOCIAL.mailto}>
            Email
          </a>
          <button
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
            <nav className="menu" aria-label="Site">
              <ul>
                {MENU_LINKS.map((link) => (
                  <li key={link.label}>
                    {'mailto' in link && link.mailto ? (
                      <a href={link.href} onClick={() => setMenuOpen(false)}>
                        {link.label}
                      </a>
                    ) : link.href.startsWith('#') ? (
                      <button
                        type="button"
                        className="menu-link-btn"
                        onClick={() => onMenuNav(link.href)}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                        {link.external ? (
                          <span className="sr-only"> (opens in a new tab)</span>
                        ) : null}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="menu-contact">
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
                    alt="Twitter / X"
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
              <address className="menu-address">
                {SOCIAL.location}
                <br />
                <a href={SOCIAL.mailto}>{SOCIAL.email}</a>
              </address>
            </div>

            <p className="menu-credit">
              Inspiration taken from getcoleman.com.
            </p>
            <p className="menu-legal">
              {showPageTheme ? (
                <>
                  <button
                    type="button"
                    className="menu-theme-link"
                    aria-pressed={pageDark}
                    onClick={() => setPageDark((d) => !d)}
                  >
                    {pageDark ? 'Light mode' : 'Dark mode'}
                  </button>
                  <span className="menu-legal__sep" aria-hidden="true">
                    ·
                  </span>
                </>
              ) : null}
              <button
                type="button"
                className="menu-privacy-link"
                onClick={() => onMenuNav('#privacy')}
              >
                Privacy
              </button>
            </p>
          </div>
        </div>
      </header>

      <main id="main" className="wrapper" tabIndex={-1}>
        {view === 'privacy' ? (
          <PrivacyNotice onBack={goHome} />
        ) : view === 'cv' ? (
          <CvPage onBack={goHome} />
        ) : view === 'clips' ? (
          <ClipsPage onBack={goHome} />
        ) : view === 'events' ? (
          <EventsPage onBack={goHome} reduceMotion={reduceMotion} />
        ) : view === 'notfound' ? (
          <NotFoundPage onBack={goHome} reduceMotion={reduceMotion} />
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
          <picture>
            <source srcSet={assetPath('mascot/tactibear.webp')} type="image/webp" />
            <img
              key={heat > 0.78 ? 'squish-on' : 'squish-off'}
              src={assetPath('mascot/tactibear.gif')}
              alt=""
              width={220}
              height={207}
              decoding="async"
            />
          </picture>
        </div>
      ) : null}

      {view === 'home' && (
        <div className="slider-wrap">
          <p className="home-tagline">
            {SITE.taglineRole}
            {' · '}
            <span className="home-tagline__lock">{SITE.taglineCreds}</span>
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
      <p className="page-footer__availability">{SITE.availability}</p>
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
      </p>
    </footer>
  )
}

function CvPage({ onBack }: { onBack: () => void }) {
  return (
    <article className="cv-page">
      <h2 className="sr-only">CV</h2>
      <p className="cv-lead">{SITE_TAGLINE}</p>
      <p className="cv-availability">{SITE.availability}</p>

      <div className="cv-partners" aria-label="Partners">
        {PARTNERS.map((name) => (
          <span key={name} className="cv-partners__item">
            {name}
          </span>
        ))}
      </div>

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
        <button type="button" className="text-btn" onClick={() => window.print()}>
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

  const select = (i: number, play = true) => {
    const next = ((i % total) + total) % total
    setIndex(next)
    setShouldPlay(play)
    const slug = CLIPS[next].slug
    const nextHash = clipHash(slug)
    if (window.location.hash !== nextHash) {
      history.replaceState(null, '', nextHash)
    }
  }

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
    if (!window.location.hash.startsWith('#clips/')) {
      history.replaceState(null, '', clipHash(CLIPS[index].slug))
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
    return () => window.removeEventListener('hashchange', onHash)
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
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setIndex((i) => (i + 1) % total)
        setShouldPlay(true)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setIndex((i) => (i - 1 + total) % total)
        setShouldPlay(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [total])

  return (
    <article className="clips-page">
      <header className="clips-header">
        <h2>Clips</h2>
        <p className="clips-lead">
          Casters and co-streams roasting my camera work — included because
          observing is a live craft.
        </p>
        <p className="clips-keys">
          <span className="clips-keys__hint">← → to change clip</span>
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
          <blockquote className="clip-quote">
            <p>&ldquo;{clip.quote}&rdquo;</p>
          </blockquote>
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
                aria-label={item.title}
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

  return (
    <article className="events-page">
      <header className="events-header">
        <h2>Events</h2>
        <p className="events-hint">Tap or hover an event to view the still</p>
        <div className="events-toolbar">
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

      {EVENT_YEARS.map((group) => {
        const events = emmyOnly
          ? group.events.filter((e) => e.emmy)
          : group.events
        if (!events.length) return null

        return (
          <section key={group.year} id={`events-year-${group.year}`} className="year">
            <h3>{group.year}</h3>
            {events.map((event) => (
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
        )
      })}

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
            alt=""
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
  reduceMotion,
}: {
  onBack: () => void
  reduceMotion: boolean
}) {
  const miss = CLIPS.find((c) => c.file === 's1mple-1v2')
  return (
    <article className="not-found">
      <p className="not-found__code">404</p>
      <h2 className="not-found__title">Missed the play.</h2>
      <p className="not-found__lead">
        This URL isn&rsquo;t on the broadcast. Prius is observing a different
        map.
      </p>
      {miss ? (
        <div className="not-found__viewer">
          <figure className="not-found__stage">
            {reduceMotion ? (
              <img
                src={assetPath('404/s1mple-1v2.jpg')}
                alt=""
                width={640}
                height={360}
                decoding="async"
              />
            ) : (
              <img
                src={assetPath('404/s1mple-1v2.gif')}
                alt=""
                width={640}
                height={360}
                decoding="async"
              />
            )}
          </figure>
          <blockquote className="not-found__quote">
            <p>&ldquo;{miss.quote}&rdquo;</p>
            <footer className="not-found__clip-note">{miss.note}</footer>
          </blockquote>
        </div>
      ) : null}
      <p className="page-back">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
      </p>
    </article>
  )
}

function PrivacyNotice({ onBack }: { onBack: () => void }) {
  return (
    <article className="privacy">
      <h2>Privacy</h2>
      <p className="privacy-lead">
        Personal hiring site for David &ldquo;prius&rdquo; Kuntz. I try not to
        collect anything I don&rsquo;t need.
      </p>

      <h3>Who is responsible</h3>
      <p>
        Controller: David Kuntz.
        <br />
        Contact:{' '}
        <a href={`mailto:${CONTROLLER_EMAIL}`}>{CONTROLLER_EMAIL}</a>
      </p>

      <h3>What this site does (and does not) do</h3>
      <ul>
        <li>No analytics, pixels, or marketing cookies.</li>
        <li>Fonts are self-hosted (no Google Fonts request from your browser).</li>
        <li>No accounts or newsletter signup — just email / social if you want.</li>
        <li>
          Event photos and clip videos are served from this site. Opening an
          event still does not call Flickr or Smugmug.
        </li>
      </ul>

      <h3>Session storage</h3>
      <p>
        For this browser tab only, the site may store the hard-sell slider
        position (<code>{STORAGE_KEY}</code>) and whether you turned on dark
        mode on subpages (<code>{PAGE_DARK_KEY}</code>). That stays on your
        device, isn&rsquo;t a cookie, and clears when the tab closes. Block
        storage and everything still works with defaults.
      </p>

      <h3>When you contact me</h3>
      <p>
        Email (<a href={`mailto:${CONTROLLER_EMAIL}`}>{CONTROLLER_EMAIL}</a>) or
        a DM on X goes through that provider under their terms. I only use the
        message to reply about observing / booking. Legal basis: Art. 6(1)(b)
        and/or 6(1)(f) GDPR. You can ask for access, correction, deletion, or to
        object — same address. EU folks can also complain to their supervisory
        authority.
      </p>

      <h3>Photos &amp; clips</h3>
      <p>
        Events stills are local copies with credit links back to the original
        Flickr / ESL / organizer albums (Riot / VCT Americas / BLAST / etc.).
        Clips are local files with links to the Twitch originals. The chat
        ticker uses self-hosted 7TV emote frames, not a live Twitch feed.
        Rights stay with the photographers and organizers unless a source page
        says otherwise.
      </p>

      <h3>External links</h3>
      <p>
        Liquipedia, X, LinkedIn, Flickr, Twitch, mailto — once you leave, their
        rules apply.
      </p>

      <h3>Hosting</h3>
      <p>
        Served from GitHub Pages for{' '}
        <a href="https://ingame.observer/">ingame.observer</a>. Hosts see the
        usual connection fluff (IP, user agent) in logs; that&rsquo;s GitHub&rsquo;s
        side —{' '}
        <a
          href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
          target="_blank"
          rel="noopener noreferrer"
        >
          their privacy statement
        </a>
        . I&rsquo;m not running extra tracking on top.
      </p>
      <p>
        There&rsquo;s a basic Content Security Policy in the HTML. Spotted
        something sketchy?{' '}
        <a href={`mailto:${CONTROLLER_EMAIL}`}>{CONTROLLER_EMAIL}</a>
        {' · '}
        <a href="/.well-known/security.txt">security.txt</a>
      </p>

      <p className="privacy-updated">Last updated: 30 August 2026</p>

      <p>
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
      </p>
    </article>
  )
}

export default App
