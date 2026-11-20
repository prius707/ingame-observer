# Install / deploy

There is nothing to install on a server: GitHub builds and publishes the site automatically every time `main` changes, using the **Deploy to GitHub Pages** workflow in `.github/workflows/`. It installs, runs the tests, audits dependencies and builds before publishing.

## One-time GitHub settings (already done for the live site)

1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Custom domain: your domain, with **Enforce HTTPS** on.
3. At your DNS provider, four A records for the domain: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.

The repo stays **public**: on a free GitHub account, Pages only publishes public repos. Never commit secrets or `.env` files here.

## Preview a change on a Linux / Unraid server (optional)

Needs only Docker. Then open `http://<server-ip>:4173`:

```bash
git clone https://github.com/prius707/ingame-observer.git
cd ingame-observer
docker run --rm -it -p 4173:4173 -v "$PWD":/app -w /app node:22-alpine \
  sh -c "npm ci && npm test && npm run build && npx vite preview --host 0.0.0.0 --port 4173"
```

Ctrl+C stops it.

## On your own computer

Needs Node 22: `npm ci`, then `npm run dev` and open http://localhost:5173.
