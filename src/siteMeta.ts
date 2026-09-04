/** Titles, descriptions, and JSON-LD for crawlers + client view changes. */
export const PAGE_TITLES = {
  home: 'prius - freelance observer',
  cv: 'CV · prius - freelance observer',
  clips: 'Clips · prius - freelance observer',
  events: 'Events · prius - freelance observer',
  privacy: 'Privacy · prius',
  notfound: '404 · prius',
  contact: 'Book · prius - freelance observer',
} as const

export const PAGE_DESCRIPTIONS = {
  home: 'prius — Sports Emmy winner (four nominations, one win). Freelance VALORANT & Counter-Strike observer. Majors, Masters, Champions. Book at dj@ingame.observer.',
  cv: 'CV for David Kuntz (prius) — freelance VALORANT and Counter-Strike observer. Sports Emmy winner. Based in Los Angeles, travel-ready.',
  clips: 'Watch-party clips of prius observing VALORANT and Counter-Strike — casters roasting the camera work.',
  events: 'LAN and league stages prius has observed — VALORANT and Counter-Strike, including Sports Emmy-winning Champions coverage.',
  privacy:
    'Privacy notice for ingame.observer — controller David Kuntz, Cloudflare + GitHub Pages/Fastly hosting, mailto booking, sessionStorage only.',
  notfound: 'This URL is not on the broadcast. Book prius for VALORANT and Counter-Strike observing at dj@ingame.observer.',
  contact:
    'Book prius for VALORANT and Counter-Strike observing. Email dj@ingame.observer — international LANs and league stages.',
} as const

export const OG_IMAGE_ALT =
  'prius — freelance VALORANT and Counter-Strike observer, Sports Emmy winner'

export const BOOKING = {
  label: 'Book',
  longLabel: 'Book observing',
  aria: 'Book observing via email',
} as const

export const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'David Kuntz',
  alternateName: ['prius', 'priusOBS'],
  jobTitle: 'Freelance VALORANT and Counter-Strike observer',
  description:
    'Sports Emmy winner. VALORANT and Counter-Strike observer for Majors, Masters, and Champions.',
  url: 'https://ingame.observer/',
  email: 'dj@ingame.observer',
  image: 'https://ingame.observer/og-image.jpg',
  sameAs: [
    'https://x.com/priusOBS',
    'https://www.linkedin.com/in/david-kuntz-3521847a',
    'https://liquipedia.net/valorant/Prius',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Los Angeles',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  knowsAbout: ['VALORANT', 'Counter-Strike', 'esports broadcast observing'],
} as const

export const PERSON_JSON_LD_TEXT = JSON.stringify(PERSON_JSON_LD)

export const SPA_FOLDERS = [
  'cv',
  'clips',
  'events',
  'privacy',
  'contact',
  'awards',
] as const

export type MetaView = keyof typeof PAGE_TITLES

export function descriptionForView(view: MetaView): string {
  return PAGE_DESCRIPTIONS[view]
}
