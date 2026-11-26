import { SITE, SOCIAL } from '../data'
import { BOOKING } from '../siteMeta'
import type { View } from '../paths'

export const SECURITY_TXT = '/.well-known/security.txt'

export function PageFooter({
  onGo,
}: {
  onGo: (next: Exclude<View, 'notfound'>) => void
}) {
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
        <a
          href="/privacy"
          onClick={(e) => {
            e.preventDefault()
            onGo('privacy')
          }}
        >
          Privacy
        </a>
        {' · '}
        <a href={SECURITY_TXT}>security.txt</a>
      </p>
    </footer>
  )
}
