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
