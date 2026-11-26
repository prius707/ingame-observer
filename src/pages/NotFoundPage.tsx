import { SOCIAL } from '../data'
import { BOOKING } from '../siteMeta'
import { assetPath, type View } from '../paths'

export function NotFoundPage({
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
