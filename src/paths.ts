/** Vite base URL — `/` on the custom domain (and locally). */
const base = import.meta.env.BASE_URL

export function assetPath(path: string) {
  return `${base}${path.replace(/^\//, '')}`
}

export const SITE_ORIGIN = 'https://ingame.observer' as const
export const SITE_BASE_PATH = base.replace(/\/$/, '') || ''
export const SITE_URL = `${SITE_ORIGIN}${SITE_BASE_PATH}` as const
