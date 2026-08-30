# prius · ingame.observer

Hiring site for **prius** — Sports Emmy winner (four nominations, one win). VALORANT & CS2 observer.

Live: **https://ingame.observer/** · Repo: [github.com/prius707/ingame-observer](https://github.com/prius707/ingame-observer)

Inspired by [getcoleman.com](https://getcoleman.com/): one page of copy and a **Less Hard Sell → More Hard Sell** slider that rewrites the pitch from shrug to full scream.

## Privacy

- Self-hosted fonts, no analytics cookies.
- Event stills + clips live on this origin (credit links still go to Flickr / Twitch / etc.).
- `sessionStorage` only for slider position + subpage dark mode (see `#privacy`).
- Hosted on GitHub Pages. `public/_headers` is for Cloudflare/Netlify-style hosts — Pages ignores it. If you put Cloudflare in front, copy the header list from [docs/cloudflare-headers.md](docs/cloudflare-headers.md).
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

## Stack

React + TypeScript + Vite
