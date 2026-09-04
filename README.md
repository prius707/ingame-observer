# prius · ingame.observer

Hiring site for **prius** — Sports Emmy winner (four nominations, one win). VALORANT & Counter-Strike observer.

Live: **https://ingame.observer/** · Repo: [github.com/prius707/ingame-observer](https://github.com/prius707/ingame-observer)

Inspired by [getcoleman.com](https://getcoleman.com/): one page of copy and a **Less Hard Sell → More Hard Sell** slider that rewrites the pitch from shrug to full scream.

## Privacy

- Self-hosted fonts. No first-party cookies. Slider uses tab-scoped `sessionStorage` (`priusSliderPos`) only. No cookie wall.
- Cloudflare Web Analytics is disabled on the zone (2026-09-04). `/privacy` says no analytics/pixels/marketing cookies. Re-check live HTML if that setting changes.
- Event stills + clips live on this origin (credit links still go to Flickr / Twitch / etc.).
- `sessionStorage` only for slider position (see `/privacy`).
- Hosted on GitHub Pages behind Cloudflare. `public/_headers` is for Cloudflare Pages / Netlify — GitHub Pages ignores it. Header list: [docs/cloudflare-headers.md](docs/cloudflare-headers.md).
- Inbound mail: Cloudflare Email Routing → Gmail (`dj@ingame.observer`).
- Security mail: `dj@ingame.observer` · [security.txt](https://ingame.observer/.well-known/security.txt)

## Dev

```bash
npm ci
npm run dev
```

Open http://localhost:5173/

## Deploy

Pushes to `main` → `.github/workflows/deploy-pages.yml` → GitHub Pages.

One-time: Pages source = GitHub Actions, custom domain `ingame.observer`, HTTPS on, DNS A records `185.199.108.153` / `.109` / `.110` / `.111`.

Repo needs to be public for free Pages (or GitHub Pro).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite |
| `npm run build` | `tsc` + Vite build |
| `npm run preview` | preview `dist` |
| `npm run lint` | oxlint |
| `bash scripts/render-og-image.sh` | rebuild `public/og-image.jpg` from `scripts/og-card.html` |

## Stack

React + TypeScript + Vite
