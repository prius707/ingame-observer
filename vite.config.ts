import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** GitHub Pages serves 404.html for unknown paths. Copy the SPA shell so React can render the branded 404. */
function spaFallback404(): Plugin {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const dist = path.resolve('dist')
      const index = path.join(dist, 'index.html')
      const dest = path.join(dist, '404.html')
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, dest)
      }
    },
  }
}

/** Custom domain: https://ingame.observer/ */
export default defineConfig({
  base: '/',
  plugins: [react(), spaFallback404()],
})
