import { assetPath } from './paths'

export type Clip = {
  slug: string
  file: string
  title: string
  note: string
  quote: string
}

export const CLIPS: Clip[] = [
  {
    slug: 'TrustworthyUninterestedSkunkKappaWealth-pwZ1DYkREQdcs4yH',
    file: 'miss-anything',
    title: 'Miss anything?',
    note: 'Tarik — Masters Bangkok watch party, 2025',
    quote:
      'Prius, did you miss anything? Brother. Wake up and smell the flowers. You missed the whole game.',
  },
  {
    slug: 'VainEntertainingPistachioChefFrank-a0p1Me2ldyRFgppo',
    file: 'observe-the-kills',
    title: 'Observe the kills',
    note: 'Tarik — VCT Grand Finals watch party, 2023',
    quote:
      'How about you observe the fucking kills Prius? Haven’t seen a kill in a while.',
  },
  {
    slug: 'ColorfulAdventurousBulgogiRiPepperonis-bQ2oyUQeX3b3HeHr',
    file: 'miss-every-kill',
    title: 'Miss every kill',
    note: 'Tarik — watch party, 2023',
    quote:
      'What the fuck just happened? How do we miss every kill there? How?',
  },
  {
    slug: 'ObservantDeterminedMushroomBlargNaut-W41uKThKEKw9kGJq',
    file: 's1mple-1v2',
    title: 's1mple’s 1v2',
    note: 'TenZ + Tarik — Galaxy’s Edge, 2024',
    quote: 'Chat, you should all ask Prius why he missed s1mple’s 1v2.',
  },
  {
    slug: 'EnjoyableSmellyPuddingLeeroyJenkins-u3zd7pSGN8Segr5R',
    file: 'xray-toggle',
    title: 'X-ray toggle',
    note: 'Tarik — Red Bull Home Ground / VCT, 2025',
    quote: 'Prius, I get it. You toggle X-ray. You don’t have to show off.',
  },
  {
    slug: 'AthleticRacyCobblerVoteYea-hVwygWCY2Vw6RxNw',
    file: 'prius-goat',
    title: 'Prius is the GOAT',
    note: 'Tarik — ranked stream, 2025',
    quote: 'Prius is the GOAT. It has to be said. Thank you Prius, I appreciate you.',
  },
  {
    slug: 'DepressedRealLegVoHiYo-3HEhpVItE6ywL70d',
    file: 'prius',
    title: 'PRIUS',
    note: 'Tarik',
    quote: 'PRIUS.',
  },
  {
    slug: 'RockyDeafMarrowYouWHY-9SmYpN3BiuABgP-q',
    file: 'observing-kinda-good',
    title: 'Observing kinda good',
    note: 'Tarik',
    quote: 'Observing kinda good.',
  },
  {
    slug: 'AssiduousGloriousMuleFailFish-5GQ3CHdgcYjXB1Ij',
    file: 'lmaooo',
    title: 'Press a button',
    note: 'Sliggy — co-stream, 2025',
    quote:
      'Is Prius just sleeping or something? Mate, press a button.',
  },
]

export function clipSrc(file: string) {
  return assetPath(`clips/${file}.mp4`)
}

export function clipPoster(file: string) {
  return assetPath(`clips/${file}.jpg`)
}


export function clipPageUrl(slug: string) {
  return `https://clips.twitch.tv/${slug}`
}

export function clipIndexFromSlug(slug: string | null | undefined) {
  if (!slug) return -1
  return CLIPS.findIndex((c) => c.slug === slug)
}

export function parseClipSlugFromLocation(loc = window.location) {
  const hash = loc.hash
  if (hash.startsWith('#clips/')) return decodeURIComponent(hash.slice('#clips/'.length))
  const path = loc.pathname.replace(/\/+$/, '')
  const m = path.match(/^\/clips\/([^/]+)$/)
  if (m) return decodeURIComponent(m[1])
  return new URLSearchParams(loc.search).get('clip')
}

export function clipHash(slug: string) {
  return `#clips/${slug}`
}

/** True when the quote is the title again (punctuation / case ignored). */
export function clipQuoteRepeatsTitle(clip: Clip) {
  const key = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
  return key(clip.quote) === key(clip.title)
}
