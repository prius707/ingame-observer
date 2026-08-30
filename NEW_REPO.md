# Publish to github.com/prius707/ingame-observer

This branch is a **site-only** tree (no `polymarket_paper/`). Use it as the initial commit for the dedicated observer repo.

## One-time setup (you)

1. Create a **new public** repo on GitHub: **prius707/ingame-observer**
   - Do not initialize with README (empty repo).

2. Push this branch as `main`:

```bash
git clone https://github.com/prius707/portfolio.git
cd portfolio
git checkout cursor/ingame-observer-site-d453
git remote rename origin portfolio
git remote add origin https://github.com/prius707/ingame-observer.git
git push -u origin cursor/ingame-observer-site-d453:main
```

3. **GitHub → ingame-observer → Settings → Pages**
   - Source: **GitHub Actions**
   - Custom domain: **ingame.observer**
   - Enforce HTTPS: on

4. DNS for **ingame.observer** — A records:
   - `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

5. Merge **portfolio** PR that removes the site from `prius707/portfolio` (polymarket only).

Live site: **https://ingame.observer/**
