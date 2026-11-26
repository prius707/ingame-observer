import { useCallback, useEffect, useRef, useState } from 'react'
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
  type EventFlag,
  type EventGameFilter,
  type EventRangeFilter,
} from '../events'
import { eventFlagSrc, eventPhotoSrc, httpsUrl, type View } from '../paths'
import { PageFooter } from '../components/PageFooter'

function EventFlagMark({ flag }: { flag: EventFlag | null }) {
  if (!flag) return null
  const src = eventFlagSrc(flag.code)
  if (!src) return null
  return (
    <img
      className="award-flag"
      src={src}
      alt={flag.country}
      width={16}
      height={12}
      decoding="async"
    />
  )
}

function EventRow({
  event,
  year,
  active,
  pinned,
  inlinePhoto,
  onHoverStart,
  onHoverEnd,
  onTogglePin,
}: {
  event: EventEntry
  year: number
  active: boolean
  pinned: boolean
  inlinePhoto: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
  onTogglePin: () => void
}) {
  const photoSrc = event.photo?.imageUrl
    ? eventPhotoSrc(event.photo.imageUrl)
    : null
  const creditHref = event.photo?.pageUrl
    ? httpsUrl(event.photo.pageUrl)
    : null
  const hasPhoto = Boolean(photoSrc)
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
        onPointerEnter={(e) => {
          if (hasPhoto && !inlinePhoto && e.pointerType === 'mouse') {
            onHoverStart()
          }
        }}
        onPointerLeave={(e) => {
          if (hasPhoto && !inlinePhoto && e.pointerType === 'mouse') {
            onHoverEnd()
          }
        }}
      >
        <figcaption>
          {hasPhoto ? (
            <button
              type="button"
              className="award-name"
              onClick={onTogglePin}
              aria-pressed={pinned}
            >
              {label}
              <EventFlagMark flag={flag} />
              {emmyLabel ? (
                <span className={`award-emmy award-emmy--${event.emmy}`}>
                  {emmyLabel}
                </span>
              ) : null}
              {event.role ? (
                <span className="award-role">{event.role}</span>
              ) : null}
            </button>
          ) : (
            <span className="award-name award-name--static">
              {label}
              <EventFlagMark flag={flag} />
              {emmyLabel ? (
                <span className={`award-emmy award-emmy--${event.emmy}`}>
                  {emmyLabel}
                </span>
              ) : null}
              {event.role ? (
                <span className="award-role">{event.role}</span>
              ) : null}
            </span>
          )}
        </figcaption>
        {active && photoSrc && event.photo ? (
          <img
            className={inlinePhoto ? 'award-inline-photo' : undefined}
            src={photoSrc}
            alt={event.photo.title || `${event.name} still`}
            decoding="async"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : null}
      </figure>
      {active && event.photo && inlinePhoto ? (
        <p className="award-inline-credit">
          {creditHref ? (
            <a
              href={creditHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {event.photo.title || 'Photo'}
            </a>
          ) : (
            <span>{event.photo.title || 'Photo'}</span>
          )}
          <span>
            {event.photo.license} · {photoCredit}
          </span>
        </p>
      ) : null}
      {active && event.photo && !inlinePhoto ? (
        <p
          className="award-photo-credit"
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') onHoverStart()
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') onHoverEnd()
          }}
        >
          {creditHref ? (
            <a
              className="award-photo-credit__title"
              href={creditHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {event.photo.title || 'Photo'}
            </a>
          ) : (
            <span className="award-photo-credit__title">
              {event.photo.title || 'Photo'}
            </span>
          )}
          <span className="award-photo-credit__copy">
            {event.photo.license} · {photoCredit}
          </span>
        </p>
      ) : null}
    </div>
  )
}

export function EventsPage({
  onBack,
  onGo,
  reduceMotion,
}: {
  onBack: () => void
  onGo: (next: Exclude<View, 'notfound'>) => void
  reduceMotion: boolean
}) {
  const [pinnedId, setPinnedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [emmyOnly, setEmmyOnly] = useState(false)
  const [game, setGame] = useState<EventGameFilter>('all')
  const [range, setRange] = useState<EventRangeFilter>('recent')
  const hoverTimerRef = useRef<number | null>(null)

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }, [])

  const clearSelection = useCallback(() => {
    clearHoverTimer()
    setPinnedId(null)
    setHoveredId(null)
  }, [clearHoverTimer])

  useEffect(() => clearHoverTimer, [clearHoverTimer])

  useEffect(() => {
    if (!pinnedId && !hoveredId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection()
      }
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target
      if (
        target instanceof Element &&
        target.closest('.award-name, .award-photo-credit, .award-inline-credit')
      ) {
        return
      }
      setPinnedId(null)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [pinnedId, hoveredId, clearSelection])

  const activeId = pinnedId ?? hoveredId
  const filtered = filterEventYears(EVENT_YEARS, { game, range, emmyOnly })
  const empty = filtered.length === 0

  return (
    <article className="events-page">
      <header className="events-header">
        <h2>Events</h2>
        <p className="events-hint">
          {reduceMotion
            ? 'Click or tap an event to view the still'
            : 'Hover to preview · Click or tap to pin'}
        </p>
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
                onClick={() => {
                  clearSelection()
                  setGame(value)
                }}
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
              onClick={() => {
                clearSelection()
                setRange('recent')
              }}
            >
              Last 3 years
            </button>
            <button
              type="button"
              className={`events-chip${range === 'all' ? ' is-on' : ''}`}
              aria-pressed={range === 'all'}
              onClick={() => {
                clearSelection()
                setRange('all')
              }}
            >
              All years
            </button>
          </div>
          <label className="events-filter">
            <input
              type="checkbox"
              checked={emmyOnly}
              onChange={(e) => {
                clearSelection()
                setEmmyOnly(e.target.checked)
              }}
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
              onClick={() => {
                clearSelection()
                setRange('all')
              }}
            >
              Show all years
            </button>
          ) : game !== 'all' ? (
            <button
              type="button"
              className="text-btn"
              onClick={() => {
                clearSelection()
                setGame('all')
              }}
            >
              Show all games
            </button>
          ) : (
            <button
              type="button"
              className="text-btn"
              onClick={() => {
                clearSelection()
                setEmmyOnly(false)
              }}
            >
              Clear Emmy filter
            </button>
          )}
        </p>
      ) : null}

      {filtered.map((group) => (
        <section
          key={group.year}
          id={`events-year-${group.year}`}
          className="year"
        >
          <h3>{group.year}</h3>
          {group.events.map((event) => {
            const rowId = `${group.year}-${event.name}`
            return (
              <EventRow
                key={rowId}
                event={event}
                year={group.year}
                active={activeId === rowId}
                pinned={pinnedId === rowId}
                inlinePhoto={reduceMotion}
                onHoverStart={() => {
                  clearHoverTimer()
                  setHoveredId(rowId)
                }}
                onHoverEnd={() => {
                  clearHoverTimer()
                  hoverTimerRef.current = window.setTimeout(() => {
                    setHoveredId((id) => (id === rowId ? null : id))
                  }, 150)
                }}
                onTogglePin={() => {
                  clearHoverTimer()
                  if (pinnedId === rowId) {
                    setPinnedId(null)
                    setHoveredId(null)
                  } else {
                    setPinnedId(rowId)
                  }
                }}
              />
            )
          })}
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

      <PageFooter onGo={onGo} />

      <p className="page-back">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
      </p>
    </article>
  )
}
