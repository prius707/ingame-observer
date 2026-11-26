import { CONTROLLER_EMAIL, SOCIAL } from '../data'
import type { View } from '../paths'
import { SECURITY_TXT } from '../components/PageFooter'

export function PrivacyNotice({
  storageKey,
  onBack,
  onGo,
}: {
  storageKey: string
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
          No analytics, pixels, or marketing cookies. Cloudflare Web Analytics
          and Zaraz are off on this hostname (zone confirmed 4 September
          2026). Live HTML does not inject a{' '}
          <code>cloudflareinsights</code> beacon.
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
        position (<code>{storageKey}</code>). That stays on your device,
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
        <code>sessionStorage</code> key <code>{storageKey}</code> — tab
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
        Liquipedia, X, LinkedIn, Flickr, Twitch, Discord, mailto — once you
        leave, their rules apply. <code>/discord</code> on this origin is a
        static bounce to a Discord invite; after that hop you are on Discord.
      </p>

      <h3>Security</h3>
      <p>
        There is a CSP meta in the HTML (<code>script-src &apos;self&apos;</code>,
        no inline handlers). HTTP header copies of that policy belong on the
        Cloudflare zone — GitHub Pages will not send them. Spotted something
        sketchy?{' '}
        <a href={SOCIAL.mailto}>{CONTROLLER_EMAIL}</a>
        {' · '}
        <a href={SECURITY_TXT}>security.txt</a>
      </p>

      <p className="privacy-updated">Last updated: 16 September 2026</p>

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
