# Changelog

This repository deploys continuously to GitHub Pages from `main` (`.github/workflows/deploy-pages.yml`) and does not currently publish git tags or versioned releases (`package.json` version is `1.0.0`). Notable changes below are summarized from git history on `main`.

## 2026-11-26

- Added `CHANGELOG.md`.
- Updated `.gitignore` to ignore `.env` and `.env.*` files while keeping `.env.example` allowed.

## 2026-11-19

- Added `INSTALL.md` covering GitHub Pages setup, optional Docker preview on a Linux/Unraid server, and local Node 22 development (#41).
- Fixed a blank-page bug when restoring a fractional slider position from `sessionStorage` by restricting `parseSavedPitch()` (`src/sliderPos.ts`) to whole-number indices, added `node:test` coverage (`tests/sliderPos.test.ts`, `npm test`), and ran tests in the Pages deploy workflow before build (#40).
- Clarified in `README.md` that the repository is intentionally public for GitHub Free Pages (#40).

## 2026-10-27

- Replaced the Masters Santiago event still with a locally mirrored front-facing trophy-lift photo (#38).

## 2026-10-26

- Centered photosensitivity warning copy inside its container (#37).
- Swapped Masters London and Masters Santiago stills for locally mirrored official trophy-lift photos (#36).
- Added a CSS scrim, backing, and text shadow when hover stills appear on the Events page so headings, filters, years, and Emmy tags stay readable over bright photos (#33).
- Applied Liquipedia audit fixes to the Events list: merged duplicate 2026 Americas Stage 2 rows, corrected venue flags, moved the 2020 BLAST London still to Spring Regular Season, and removed misattributed ESL Pro League Americas photos (#35).
- Removed duplicate showmatch entries (`Ludwig x Tarik Invitational 2 Showmatch` and `Red Bull Home Ground #4 Showmatch`) already covered by their parent events (#34).

## 2026-10-22

- Added 92 missing Liquipedia broadcast events (38 VALORANT, 53 Counter-Strike, plus THE CS MINOR) and locally mirrored trophy stills for Champions Shanghai and Spotlight (#32).
- Added Champions Shanghai 2026 with a locally mirrored trophy-lift photo and replaced regional-indicator emoji with self-hosted flag SVGs (`public/flags/`) for Windows compatibility (#31).
- Upgraded Vite to `8.3.5` to patch advisories, pinned GitHub Actions to commit SHAs, dropped `id-token: write` from the build job, and switched CI to `npm@11` for `npm audit --audit-level=high` (#30).

## 2026-09-16

- Hardened URL handling and CSP defenses, and tightened hiring copy (#29).

## 2026-09-09

- Added the VCT Americas Stage 2 São Paulo finals trophy lift and restored the six-row 2026 Events ordering (#25, #26).

## 2026-09-05

- Added `/discord` (`public/discord/index.html`) redirecting to the Discord invite (#24).

## 2026-09-04

- Tightened booking CTAs, added `/contact`, generated per-page SEO titles/descriptions/canonicals, improved 404 recovery links, re-encoded large clip MP4s to 480p/30, and compressed large event stills and the favicon (#20, #23).
- Updated `/privacy` and `docs/cloudflare-headers.md` to reflect GitHub Pages + Cloudflare hosting, Cloudflare Email Routing, and Cloudflare Web Analytics being disabled on the zone (#23).
- Replaced the burger menu overlay with header navigation links and set the browser tab title to `prius - freelance observer` (#21, #22).

## 2026-09-03

- Made dark mode the default on CV, Clips, and Events (#17).
- Standardized game naming to Counter-Strike across copy and the OG preview image (`public/og-image.jpg`) (#14, #16).
- Noted current Riot Games work alongside consulting (#15) and rewrote hard-sell slider copy (#13).
- Shipped path-based routes, booking `mailto:` links, and a dark overlay menu (#18, #19).

## 2026-09-02

- Enlarged home sell copy and updated the 404 page with the s1mple 1v2 clip (#11).

## 2026-08-30

- Initial release of the `ingame.observer` React + TypeScript + Vite hiring site with the **Less Hard Sell → More Hard Sell** slider, CV, Clips, Events, and Privacy views.
- Self-hosted event stills, added `public/.well-known/security.txt`, CSP/referrer protections, animated 7TV favicon, travel country flags, dark mode toggle, Liquipedia icon, and `dj@ingame.observer` contact details.
