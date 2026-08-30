/** Curated watch-party chat lines for the Clips ticker (not a live embed). */

import { assetPath } from './paths'

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
  'EZ',
  'BASED',
  'NODDERS',
  'Gladge',
  'AlienPls',
] as const

export type ChatEmote = (typeof CHAT_EMOTES)[number]

export function emoteSrc(name: ChatEmote) {
  return assetPath(`emotes/${name}.webp`)
}

export const CHAT_LINES: ChatLine[] = [
  {
    user: 'jaylen_ttv',
    color: '#1f8a70',
    text: 'prius is the GOAT it has to be said',
  },
  {
    user: 'milo4k',
    color: '#c45c26',
    text: 'that x-ray toggle was filthy :CatJam:',
  },
  {
    user: 'nassir',
    color: '#2a6fdb',
    text: 'So good.',
  },
  {
    user: 'kevinthethird',
    color: '#b33b5c',
    text: 'You’re pretty good at it',
  },
  {
    user: 'ryu_cs',
    color: '#0f7a8a',
    text: 'obs cooking rn',
  },
  {
    user: 'softreset_',
    color: '#6b4f2a',
    text: 'four Emmy noms and a win and still catching strays :PRIUS:',
  },
  {
    user: 'annafromohio',
    color: '#3d6b4f',
    text: 'rare praise arc ??',
  },
  {
    user: 'bren4sen',
    color: '#c0392b',
    text: 'Thank you Prius I appreciate you :peepoHappy:',
  },
  {
    user: 'noctis92',
    color: '#1a6b8a',
    text: 'timing on that multi was insane',
  },
  {
    user: 'pablo_gg',
    color: '#8a5a2b',
    text: 'book this man already',
  },
  {
    user: 'yute_',
    color: '#2f6b3a',
    text: 's1mple 1v2 was NOT even him btw',
  },
  {
    user: 'drewwins',
    color: '#a14a3a',
    text: 'PRIUs W :Clap:',
  },
  {
    user: 'samiira',
    color: '#1b6b9a',
    text: 'wait the cam was actually cracked there',
  },
  {
    user: 'coldbrew7',
    color: '#9a4a2a',
    text: 'chat stop blaming him he hit that :PRIUS:',
  },
  {
    user: 'nxde_',
    color: '#2d7a4e',
    text: 'obs saved the round fr',
  },
  {
    user: 'markymarktv',
    color: '#7a5a1a',
    text: 'named in the toolkit patch and still catching Ls :Gladge:',
  },
  {
    user: 'louie_fps',
    color: '#c45a6a',
    text: 'suspense xray then BAM',
  },
  {
    user: 'tristanx',
    color: '#3a6a8a',
    text: 'tarik said goat out loud????',
  },
  {
    user: 'elli0t',
    color: '#5a4a8a',
    text: 'clean switch clean kill clean everything',
  },
  {
    user: 'jadeonmain',
    color: '#8a3a4a',
    text: 'productions keep booking him for a reason :BASED:',
  },
  {
    user: 'coryy',
    color: '#1a7a5a',
    text: 'bro the hold was perfect',
  },
  {
    user: 'benji_live',
    color: '#b35a20',
    text: 'how is the roast also a compliment :PRIUS:',
  },
  {
    user: 'skye0',
    color: '#2a5a9a',
    text: 'that’s elite observer timing',
  },
  {
    user: 'omarrr',
    color: '#6a3a2a',
    text: 'smell the flowers then book him',
  },
  {
    user: 'nickfromchat',
    color: '#0a6a7a',
    text: 'caught the whole sequence for once chat',
  },
  {
    user: 'zoe_vct',
    color: '#8a2a3a',
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
