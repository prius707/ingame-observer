# Headers (GitHub Pages vs Cloudflare)

This site builds to GitHub Pages. Pages will not read `public/_headers`.

The HTML CSP meta in `index.html` still covers a lot (scripts/styles/images/media on `'self'`). Stuff that needs a real HTTP header — HSTS, `X-Frame-Options`, `frame-ancestors` — only shows up if something in front of Pages sets it.

## Cloudflare in front

1. Orange-cloud `ingame.observer`, origin still GitHub Pages.
2. Transform Rule → modify response headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' mailto:; upgrade-insecure-requests
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

3. Always HTTPS. HSTS preload later if you want.

`public/_headers` mirrors the same list for Cloudflare Pages / Netlify if the host ever moves.

## prius.observer → ingame.observer (Zone / CoS)

Live check 2026-09-04: Cloudflare returns `301 Location: https://ingame.observer/` for every `prius.observer` path (`/`, `/events`, `/cv`, `/clips?x=1`). Path and query are stripped. This repo has no redirect for that host — `public/CNAME` is `ingame.observer` only.

Fix in the Cloudflare zone (Bulk Redirect, Single Redirect, or Dynamic Redirect), not GitHub Pages:

- Source: `https://prius.observer/*`
- Target: `https://ingame.observer/${1}` (keep path)
- Status: 301
- Preserve query string: on

Dynamic expression equivalent:

```
http.host eq "prius.observer"
concat("https://ingame.observer", http.request.uri.path, http.request.uri.query != "" ? "?" : "", http.request.uri.query)
```

After that, `https://prius.observer/events` should land on `https://ingame.observer/events`.

## Web Analytics (Zone)

Zone confirmed 4 September 2026: Cloudflare Web Analytics is **disabled** on `ingame.observer`. Live HTML no longer injects `cloudflareinsights` / `beacon.min.js`. Zaraz inactive. Bot Fight off.

Email Address Obfuscation (Scrape Shield) remains on. That may inject `/cdn-cgi/` email-decode JS if Cloudflare rewrites an address in HTML — scrape protection, not analytics. `/privacy` discloses it that way.

If Web Analytics is ever turned back on, update `/privacy` before claiming “no analytics” again. The first-party CSP (`script-src 'self'`) does not list `static.cloudflareinsights.com`; keep CSP as-is.
