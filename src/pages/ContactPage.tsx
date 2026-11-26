import { SITE, SOCIAL } from '../data'
import { BOOKING } from '../siteMeta'
import type { View } from '../paths'
import { PageFooter } from '../components/PageFooter'

export function ContactPage({
  onBack,
  onGo,
}: {
  onBack: () => void
  onGo: (next: Exclude<View, 'notfound'>) => void
}) {
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
        Opens your mail app with Event / Dates filled in. Same address if you
        just write.
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
      <PageFooter onGo={onGo} />
      <p className="page-back">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
      </p>
    </article>
  )
}
