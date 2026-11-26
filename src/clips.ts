import { assetPath } from './paths.ts'
import { CLIPS, type Clip } from './clipsData.ts'

export { CLIPS, type Clip }

const CLIP_FILE = /^[A-Za-z0-9._-]+$/
const TWITCH_CLIP_SLUG = /^[A-Za-z0-9_-]+$/

export function clipSrc(file: string) {
  if (!CLIP_FILE.test(file)) return ''
  return assetPath(`clips/${file}.mp4`)
}

export function clipPoster(file: string) {
  if (!CLIP_FILE.test(file)) return ''
  return assetPath(`clips/${file}.jpg`)
}

export function clipPageUrl(slug: string) {
  if (!TWITCH_CLIP_SLUG.test(slug)) return null
  return `https://clips.twitch.tv/${slug}`
}

export function clipIndexFromSlug(slug: string | null | undefined) {
  if (!slug) return -1
  return CLIPS.findIndex((c) => c.slug === slug)
}

function decodeSlug(raw: string): string | null {
  try {
    return decodeURIComponent(raw)
  } catch {
    return null
  }
}

/** Known clip slugs only — URL junk must not reach canonicals or Twitch links. */
export function parseClipSlugFromLocation(loc = window.location) {
  try {
    let raw: string | null = null
    const hash = loc.hash
    if (hash.startsWith('#clips/')) {
      raw = decodeSlug(hash.slice('#clips/'.length))
    } else {
      const path = loc.pathname.replace(/\/+$/, '')
      const m = path.match(/^\/clips\/([^/]+)$/)
      if (m) raw = decodeSlug(m[1])
      else raw = new URLSearchParams(loc.search).get('clip')
    }
    if (!raw) return null
    const i = clipIndexFromSlug(raw)
    return i >= 0 ? CLIPS[i].slug : null
  } catch {
    return null
  }
}

export function clipHash(slug: string) {
  return `#clips/${encodeURIComponent(slug)}`
}

/** True when the quote is the title again (punctuation / case ignored). */
export function clipQuoteRepeatsTitle(clip: Clip) {
  const key = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
  return key(clip.quote) === key(clip.title)
}
