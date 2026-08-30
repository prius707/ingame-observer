# Security headers on GitHub Pages + Cloudflare

`ingame.observer` is deployed with **GitHub Pages**. Pages **does not** honor `public/_headers` (that format is for Netlify / Cloudflare Pages). The in-page CSP `<meta>` in `index.html` still applies for most directives, but **cannot** enforce:

- `frame-ancestors` (clickjacking)
- `Strict-Transport-Security`
- `X-Frame-Options` / `Permissions-Policy` as true HTTP headers

## Recommended: Cloudflare in front of the custom domain

1. Add the site to Cloudflare (proxied DNS / orange cloud) for `ingame.observer`.
2. Keep GitHub Pages as the origin (existing A records → Cloudflare proxies them).
3. **Rules → Transform Rules → Modify response header** (or Configuration Rules) and set:

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' mailto:; upgrade-insecure-requests` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |

4. Enable **HTTPS / Always Use HTTPS** and consider HSTS preload once stable.
5. Keep `public/_headers` in the repo as the source of truth if you later move the host to Cloudflare Pages or Netlify.

## What the app already does without Cloudflare

- CSP via HTML meta (scripts, styles, images, media locked to `'self'` + `data:` for images)
- Event stills and clip videos are **self-hosted** (no Flickr/Smugmug image requests)
- Self-hosted fonts; no analytics SDKs
- `referrerPolicy="no-referrer"` on event `<img>` tags
- `/.well-known/security.txt` and `robots.txt`
