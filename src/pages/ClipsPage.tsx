import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CLIPS,
  clipHash,
  clipIndexFromSlug,
  clipPageUrl,
  clipPoster,
  clipQuoteRepeatsTitle,
  clipSrc,
  parseClipSlugFromLocation,
} from '../clips'
import { clipPath, usesClipHash, type View } from '../paths'
import { ChatTicker } from '../components/ChatTicker'
import { PageFooter } from '../components/PageFooter'

const CLIP_DEFAULT_VOLUME = 0.3

export function ClipsPage({
  onBack,
  onGo,
  onClipChange,
}: {
  onBack: () => void
  onGo: (next: Exclude<View, 'notfound'>) => void
  onClipChange: (slug: string) => void
}) {
  const initialSlug = parseClipSlugFromLocation()
  const initialIndex = clipIndexFromSlug(initialSlug)
  const [index, setIndex] = useState(initialIndex >= 0 ? initialIndex : 0)
  const [shouldPlay, setShouldPlay] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stripRef = useRef<HTMLUListElement>(null)
  const volumePrefRef = useRef({ volume: CLIP_DEFAULT_VOLUME, muted: false })
  const clip = CLIPS[index]
  const twitchUrl = clipPageUrl(clip.slug)
  const total = CLIPS.length

  const applyVolumePref = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return
    el.volume = volumePrefRef.current.volume
    el.muted = volumePrefRef.current.muted
  }, [])

  const select = useCallback(
    (i: number, play = true) => {
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
    },
    [total],
  )

  const pickRandom = () => {
    if (total <= 1) return
    let next = index
    while (next === index) {
      next = Math.floor(Math.random() * total)
    }
    select(next)
  }

  useEffect(() => {
    const known = parseClipSlugFromLocation()
    const slug = known ?? CLIPS[0].slug
    if (usesClipHash()) {
      if (!window.location.hash.startsWith('#clips/') || !known) {
        history.replaceState(null, '', clipHash(slug))
      }
      return
    }
    if (
      window.location.pathname === '/clips' ||
      window.location.pathname === '/clips/' ||
      !known
    ) {
      history.replaceState(null, '', clipPath(slug))
    }
  }, [])

  useEffect(() => {
    onClipChange(clip.slug)
  }, [clip.slug, onClipChange])

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
    applyVolumePref(el)
    if (!el) return
    el.setAttribute('controlsList', 'nodownload noremoteplayback')
    try {
      el.disablePictureInPicture = true
    } catch {
      /* older browsers */
    }
  }, [index, applyVolumePref])

  useEffect(() => {
    const el = videoRef.current
    if (!el || !shouldPlay) return
    applyVolumePref(el)
    void el.play().catch(() => {
      /* autoplay blocked until gesture — controls still work */
    })
  }, [index, shouldPlay, applyVolumePref])

  useEffect(() => {
    const activeBtn = stripRef.current?.querySelector<HTMLElement>(
      '[aria-current="true"]',
    )
    activeBtn?.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
      block: 'nearest',
    })
  }, [index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.body.classList.contains('menu-open')) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target
      if (
        target instanceof HTMLElement &&
        (target.closest(
          'input, textarea, select, video, [contenteditable="true"]',
        ) ||
          target.isContentEditable)
      ) {
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        select(index + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        select(index - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, select])

  return (
    <article className="clips-page">
      <header className="clips-header">
        <h2>Clips</h2>
        <p className="clips-lead">
          Casters and co-streams roasting the camera work. Comes with the chair.
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
            onLoadedMetadata={(e) => applyVolumePref(e.currentTarget)}
            onVolumeChange={(e) => {
              volumePrefRef.current = {
                volume: e.currentTarget.volume,
                muted: e.currentTarget.muted,
              }
            }}
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
          {twitchUrl ? (
            <p className="clip-original">
              <a
                href={twitchUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open original on Twitch
              </a>
            </p>
          ) : null}
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

      <PageFooter onGo={onGo} />

      <p className="page-back">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
      </p>
    </article>
  )
}
