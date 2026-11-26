import { CV_SECTIONS, SITE, SITE_TAGLINE, SOCIAL } from '../data'
import { BOOKING } from '../siteMeta'
import { CV_QUOTES } from '../quotes'
import type { View } from '../paths'
import { PageFooter } from '../components/PageFooter'

export function CvPage({
  onBack,
  onGo,
}: {
  onBack: () => void
  onGo: (next: Exclude<View, 'notfound'>) => void
}) {
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

      <PageFooter onGo={onGo} />

      <p className="page-back">
        <button type="button" className="text-btn" onClick={onBack}>
          ← Back to the pitch
        </button>
      </p>
    </article>
  )
}
