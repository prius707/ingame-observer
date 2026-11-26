/** Curated watch-party chat lines for the Clips ticker (not a live embed). */

import { assetPath } from './paths.ts'

export type ChatLine = {
  user: string
  color: string
  /** Plain text; optional :EmoteName: tokens for self-hosted 7TV frames. */
  text: string
}

export const CHAT_EMOTES = [
  'PRIUS',
  'Clap',
  'CatJam',
  'peepoHappy',
  'BASED',
  'Gladge',
] as const

export type ChatEmote = (typeof CHAT_EMOTES)[number]

export function emoteSrc(name: ChatEmote) {
  return assetPath(`emotes/${name}.webp`)
}

export const CHAT_LINES: ChatLine[] = [
  {
    user: 'jaylen_ttv',
    color: '#34d399',
    text: 'prius is the GOAT it has to be said',
  },
  {
    user: 'milo4k',
    color: '#fb923c',
    text: 'that x-ray toggle was filthy :CatJam:',
  },
  {
    user: 'nassir',
    color: '#60a5fa',
    text: 'So good.',
  },
  {
    user: 'kevinthethird',
    color: '#f472b6',
    text: 'You’re pretty good at it',
  },
  {
    user: 'ryu_cs',
    color: '#22d3ee',
    text: 'obs cooking rn',
  },
  {
    user: 'softreset_',
    color: '#d4a373',
    text: 'four Emmy noms and a win and still catching strays :PRIUS:',
  },
  {
    user: 'annafromohio',
    color: '#6ee7b7',
    text: 'rare praise arc ??',
  },
  {
    user: 'bren4sen',
    color: '#f87171',
    text: 'Thank you Prius I appreciate you :peepoHappy:',
  },
  {
    user: 'noctis92',
    color: '#38bdf8',
    text: 'timing on that multi was insane',
  },
  {
    user: 'pablo_gg',
    color: '#f59e0b',
    text: 'clip that xray toggle',
  },
  {
    user: 'yute_',
    color: '#4ade80',
    text: 's1mple 1v2 was NOT even him btw',
  },
  {
    user: 'drewwins',
    color: '#fb7185',
    text: 'PRIUs W :Clap:',
  },
  {
    user: 'samiira',
    color: '#67e8f9',
    text: 'wait the cam was actually cracked there',
  },
  {
    user: 'coldbrew7',
    color: '#fdba74',
    text: 'chat stop blaming him he hit that :PRIUS:',
  },
  {
    user: 'nxde_',
    color: '#5eead4',
    text: 'obs saved the round fr',
  },
  {
    user: 'markymarktv',
    color: '#facc15',
    text: 'named in the toolkit patch and still catching Ls :Gladge:',
  },
  {
    user: 'louie_fps',
    color: '#f9a8d4',
    text: 'suspense xray then BAM',
  },
  {
    user: 'tristanx',
    color: '#7dd3fc',
    text: 'tarik said goat out loud????',
  },
  {
    user: 'elli0t',
    color: '#a78bfa',
    text: 'clean switch clean kill clean everything',
  },
  {
    user: 'jadeonmain',
    color: '#fda4af',
    text: 'camera was BASED :BASED:',
  },
  {
    user: 'coryy',
    color: '#2dd4bf',
    text: 'bro the hold was perfect',
  },
  {
    user: 'benji_live',
    color: '#fb923c',
    text: 'how is the roast also a compliment :PRIUS:',
  },
  {
    user: 'skye0',
    color: '#93c5fd',
    text: 'timing was filthy',
  },
  {
    user: 'omarrr',
    color: '#e6a57e',
    text: 'wake up and smell the flowers lmao',
  },
  {
    user: 'nickfromchat',
    color: '#38bdf8',
    text: 'caught the whole sequence for once chat',
  },
  {
    user: 'zoe_vct',
    color: '#f472b6',
    text: 'PRIUs COOKED :PRIUS: :Clap:',
  },
]

const EMOTE_SET = new Set<string>(CHAT_EMOTES)

export function parseChatText(text: string): Array<
  { type: 'text'; value: string } | { type: 'emote'; name: ChatEmote }
> {
  const parts: Array<
    { type: 'text'; value: string } | { type: 'emote'; name: ChatEmote }
  > = []
  const re = /:([A-Za-z0-9_]+):/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) {
      parts.push({ type: 'text', value: text.slice(last, m.index) })
    }
    const name = m[1]
    if (EMOTE_SET.has(name)) {
      parts.push({ type: 'emote', name: name as ChatEmote })
    } else {
      parts.push({ type: 'text', value: m[0] })
    }
    last = m.index + m[0].length
  }
  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) })
  }
  return parts
}
