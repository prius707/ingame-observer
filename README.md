# prius · ingame.observer

Hiring site for **prius** — Sports Emmy winner (four nominations, one win). VALORANT & CS2 observer.

Live: **https://ingame.observer/** · Repo: [github.com/prius707/ingame-observer](https://github.com/prius707/ingame-observer)

Inspired by [getcoleman.com](https://getcoleman.com/): one page of copy and a **Less Hard Sell → More Hard Sell** slider that rewrites the pitch from shrug to full scream.

## Privacy / GDPR

- Fonts are **self-hosted** (no Google Fonts CDN).
- No analytics or marketing cookies.
- Optional `sessionStorage` only for the slider position in the current tab (documented on the Privacy page).
- Privacy notice available from the menu (`#privacy`).

## Dev

```bash
npm ci
npm run dev
```

Open http://localhost:5173/ (Vite uses `/` as the base, same as the custom domain).

## Deploy (GitHub Pages)

Live URL: **https://ingame.observer/**

Pushes to `main` run `.github/workflows/deploy-pages.yml` and publish `dist/`.

**One-time setup:**

1. Repo **Settings → Pages → Build and deployment → Source:** GitHub Actions
2. **Settings → Pages → Custom domain:** `ingame.observer` (enforce HTTPS)
3. DNS A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

This repo must be **public** for free GitHub Pages (or use GitHub Pro on a private repo).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | oxlint |

## Stack

React + TypeScript + Vite
