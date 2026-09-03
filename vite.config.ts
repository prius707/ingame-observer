import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Copy index → 404.html and real path folders so GitHub Pages returns 200. */
function spaFallback404(): Plugin {
  const routes = ['cv', 'clips', 'events', 'privacy', 'contact']
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const dist = path.resolve('dist')
      const index = path.join(dist, 'index.html')
      if (!fs.existsSync(index)) return
      fs.copyFileSync(index, path.join(dist, '404.html'))
      for (const route of routes) {
        const dir = path.join(dist, route)
        fs.mkdirSync(dir, { recursive: true })
        fs.copyFileSync(index, path.join(dir, 'index.html'))
      }
      const clipsSrc = fs.readFileSync(path.resolve('src/clips.ts'), 'utf8')
      const slugs = [...clipsSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
      for (const slug of slugs) {
        const dir = path.join(dist, 'clips', slug)
        fs.mkdirSync(dir, { recursive: true })
        fs.copyFileSync(index, path.join(dir, 'index.html'))
      }
    },
  }
}

/** Custom domain: https://ingame.observer/ */
export default defineConfig({
  base: '/',
  plugins: [react(), spaFallback404()],
})
