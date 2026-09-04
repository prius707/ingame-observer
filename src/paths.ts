/** Vite base URL — `/` on the custom domain (and locally). */
const base = import.meta.env.BASE_URL

export function assetPath(path: string) {
  return `${base}${path.replace(/^\//, '')}`
}

export const SITE_ORIGIN = 'https://ingame.observer' as const
export const SITE_BASE_PATH = base.replace(/\/$/, '') || ''
export const SITE_URL = `${SITE_ORIGIN}${SITE_BASE_PATH}` as const

export type View =
  | 'home'
  | 'privacy'
  | 'cv'
  | 'events'
  | 'clips'
  | 'contact'
  | 'notfound'

const HASH_VIEWS: Record<string, View> = {
  '#privacy': 'privacy',
  '#cv': 'cv',
  '#clips': 'clips',
  '#events': 'events',
  '#awards': 'events',
  '#contact': 'contact',
}

export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '') || '/'
  if (trimmed === '/index.html') return '/'
  return trimmed
}

export function viewFromHash(hash: string): View | null {
  if (hash.startsWith('#clips/')) return 'clips'
  return HASH_VIEWS[hash] ?? null
}

export function viewFromPath(pathname: string): View {
  const path = normalizePath(pathname)
  if (path === '/') return 'home'
  if (path === '/contact') return 'contact'
  if (path === '/privacy') return 'privacy'
  if (path === '/cv') return 'cv'
  if (path === '/events' || path === '/awards') return 'events'
  if (path === '/clips' || path.startsWith('/clips/')) return 'clips'
  return 'notfound'
}

/** Hash wins so #events / #clips/slug keep working. Paths are the shareable URLs. */
export function viewFromLocation(loc = window.location): View {
  return viewFromHash(loc.hash) ?? viewFromPath(loc.pathname)
}

export function pathForView(view: Exclude<View, 'notfound'>): string {
  if (view === 'home') return '/'
  return `/${view}`
}

export function canonicalForView(view: View, clipSlug?: string | null): string {
  if (view === 'clips' && clipSlug) {
    return `${SITE_URL}/clips/${encodeURIComponent(clipSlug)}`
  }
  if (view === 'notfound') return `${SITE_URL}/`
  const path = pathForView(view)
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

export function usesClipHash(loc = window.location): boolean {
  return loc.hash === '#clips' || loc.hash.startsWith('#clips/')
}

export function clipPath(slug: string): string {
  return `/clips/${encodeURIComponent(slug)}`
}
