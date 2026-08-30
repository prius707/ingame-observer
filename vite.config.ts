import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Custom domain: https://ingame.observer/ */
export default defineConfig({
  base: '/',
  plugins: [react()],
})
