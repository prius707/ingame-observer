/** Vite base URL — `/` on the custom domain (and locally). */
const base = import.meta.env.BASE_URL

function isSafeRelativeAsset(path: string) {
  if (!path || path.includes('..') || path.includes('\\') || path.includes('\0')) {
    return false
  }
  if (path.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(path)) return false
  return true
}

export function assetPath(path: string) {
  const cleaned = path.replace(/^\//, '')
  if (cleaned === '') return base
  if (!isSafeRelativeAsset(cleaned)) return `${base}`
  return `${base}${cleaned}`
}

/** Same-origin event stills only — no remote http(s) fallback. */
export function eventPhotoSrc(imageUrl: string): string | null {
  if (!imageUrl.startsWith('event-photos/')) return null
  if (!isSafeRelativeAsset(imageUrl)) return null
  return assetPath(imageUrl)
}

/** Credit / outbound links: https only. */
export function httpsUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return null
    return parsed.href
  } catch {
    return null
  }
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
