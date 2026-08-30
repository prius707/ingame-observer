import type { ReactNode } from 'react'

export type Pitch = {
  content: ReactNode
  /** Used to pick the tallest size-guide pitch. */
  weight: number
}

const mail = 'mailto:dj@ingame.observer'
const x = 'https://x.com/priusOBS'
const liquid = 'https://liquipedia.net/valorant/Prius'

/** Soft → hard sell. Index DEFAULT_PITCH is the balanced middle. */
export const PITCHES: Pitch[] = [
  {
    weight: 48,
    content: <>So, yeah, I’m an esports observer. What of it?</>,
  },
  {
    weight: 72,
    content: (
      <>If you need a VALORANT or CS2 observer, you could email me. Or not.</>
    ),
  },
  {
    weight: 220,
    content: (
      <>
        Feel free to ignore this, but if you need a freelance observer, I might
        be worth a try. I think my observing is pretty decent, but it might not
        be your sort of thing. See what you think.
      </>
    ),
  },
  {
    weight: 210,
    content: (
      <>
        If you need an experienced freelance observer, I might be worth a try.
        My observing is pretty clean and I’ve picked up a few big stages. I can
        also handle most things from online cups to Masters weeks.
      </>
    ),
  },
  {
    weight: 280,
    content: (
      <>
        Hello. I’m prius. I’m a freelance esports observer. I frame the fight so
        casters can cook and viewers never miss the swing. I’ve got{' '}
        <a href={liquid} target="_blank" rel="noopener noreferrer">
          over 15 years of experience
        </a>{' '}
        and can handle most things from Challengers to Champions.
      </>
    ),
  },
  {
    weight: 340,
    content: (
      <>
        Hello. I’m prius. I’m a freelance esports observer. I come up with
        camera work that helps your cast land and your broadcast feel sharp.
        I’ve been in the business for 15+ years, observed CS Majors and
        VALORANT’s biggest stages — including Emmy-winning Champions coverage —
        and I can tackle everything from Challengers to international LANs.
      </>
    ),
  },
  {
    weight: 420,
    content: (
      <>
        Hello. I’m prius. I’m a freelance esports observer. I come up with
        camera work that wins the spectator experience. I’ve been in the
        business for 15+ years across CS:GO, CS2, and VALORANT, with Majors,
        Masters, and Champions on the résumé — including a Sports Emmy win for
        Champions coverage after four nominations. I’ve consulted for Riot
        Games, and I work with partners like ESL FACEIT Group, BLAST, Turner
        Sports (TBS), and Raidiant.
      </>
    ),
  },
  {
    weight: 430,
    content: (
      <>
        <strong>Broadcast-ready observing for VALORANT and CS2.</strong>
        <br />
        Hello. I’m a freelance esports observer who can help your production
        feel sharp. I’ve got 15+ years in the chair. My work spans Majors,
        Masters, and Champions — including a Sports Emmy win for Champions
        coverage (four nominations, one win). I’ve consulted for Riot Games, and
        partners like ESL FACEIT Group, BLAST, Turner Sports (TBS), and Raidiant
        keep booking me.
      </>
    ),
  },
  {
    weight: 400,
    content: (
      <>
        Want a broadcast that never misses the swing?
        <br />
        Of course you do. So get in touch now and get 15+ years of big-stage
        observing on your side. Majors, Masters, Champions. Four Sports Emmy
        nominations. One Sports Emmy win for Champions coverage. I’ve consulted
        for Riot, and partners like ESL FACEIT Group, BLAST, Turner Sports
        (TBS), and Raidiant keep booking me.
      </>
    ),
  },
  {
    weight: 280,
    content: (
      <>
        <strong>Book me. Before the other production does.</strong>
        <br />
        Get in touch now and get big-stage observing on your side. 15+ years.
        Four Sports Emmy nominations. One Emmy win — Champions coverage. CS
        Majors. VCT Masters. Riot consulting. <strong>Email me NOW.</strong>
      </>
    ),
  },
  {
    weight: 380,
    content: (
      <>
        <strong className="red">
          The production you’re pitching against could book me.
          <br />
          Dare you take that risk?
        </strong>
        <br />
        <strong>GET IN TOUCH NOW</strong> and get big-stage observing on your
        side. Proven 15+ years. Proven on Majors, Masters, and Champions. Proven
        across four Sports Emmy nominations and an Emmy win. Proven consulting
        for Riot. Proven across VALORANT and CS2.
      </>
    ),
  },
  {
    weight: 420,
    content: (
      <>
        <strong className="red">
          THE PRODUCTION YOU’RE PITCHING AGAINST COULD BOOK ME.
          <br />
          DARE YOU TAKE THAT RISK?
        </strong>
        <br />
        <strong>
          GET IN TOUCH NOW at <a href={mail}>dj@ingame.observer</a>
        </strong>
        . PROVEN 15+ years. PROVEN across four Sports Emmy nominations. PROVEN
        to win an Emmy. PROVEN on Majors, Masters, and Champions. PROVEN
        consulting for Riot. PROVEN across VALORANT and CS2. ACT NOW.
      </>
    ),
  },
  {
    weight: 480,
    content: (
      <>
        <strong className="red">
          THE PRODUCTION YOU’RE PITCHING AGAINST COULD BOOK ME.
          <br />
          DARE YOU TAKE THAT RISK?
        </strong>
        <br />
        <strong>
          GET IN TOUCH NOW at <a href={mail}>dj@ingame.observer</a>
        </strong>
        . PROVEN 15+ years. PROVEN across four Sports Emmy nominations. PROVEN
        to win an Emmy. PROVEN consulting for Riot. PROVEN on the biggest
        VALORANT and CS2 stages. ACT NOW and beat your rivals to that booking.{' '}
        <strong className="red">
          <a href={mail}>Email me</a> NOW or DM{' '}
          <a href={x} target="_blank" rel="noopener noreferrer">
            @priusOBS
          </a>
        </strong>
      </>
    ),
  },
]

export const DEFAULT_PITCH = 6

export const SITE = {
  tagline:
    'Freelance VALORANT & CS2 observer · Sports Emmy winner · Los Angeles',
  availability: 'Booking international LANs & league stages · replies within 48h',
} as const

export const PARTNERS = [
  'Riot Games',
  'ESL FACEIT Group',
  'BLAST',
  'Turner Sports',
  'Raidiant',
] as const

export const PAGE_TITLES = {
  home: 'prius',
  cv: 'CV · prius',
  clips: 'Clips · prius',
  events: 'Events · prius',
  privacy: 'Privacy · prius',
} as const

export const SOCIAL = {
  twitter: 'https://x.com/priusOBS',
  linkedin: 'https://www.linkedin.com/in/david-kuntz-3521847a',
  email: 'dj@ingame.observer',
  mailto: mail,
  location: 'Los Angeles - USA',
  liquipedia: liquid,
} as const

export const MENU_LINKS = [
  { label: 'CV', href: '#cv', external: false },
  { label: 'Clips', href: '#clips', external: false },
  { label: 'Events', href: '#events', external: false },
  { label: 'Email', href: mail, external: false, mailto: true },
] as const

export const CONTROLLER_EMAIL = 'dj@ingame.observer'

export const CV_SECTIONS = [
  {
    title: 'Freelance',
    lines: ['2010 – Present', 'VALORANT & CS2 observer'],
  },
  {
    title: 'Partners',
    lines: [
      'Riot Games (consulting)',
      'ESL FACEIT Group',
      'BLAST',
      'Turner Sports (TBS)',
      'Raidiant',
    ],
  },
  {
    title: 'Stages',
    lines: [
      'CS Majors · ESL One · ELEAGUE · IEM · BLAST',
      'VCT Champions · Masters · LOCK//IN · Americas',
    ],
  },
  {
    title: 'Recognition',
    lines: [
      'Sports Emmy Winner (2025) — Outstanding Esports Championship Coverage — VALORANT Champions Seoul 2024',
      'Sports Emmy Nominated — Champions Istanbul · Los Angeles · Paris · BLAST Fall Finals 2022',
      'Riot patch 3.04 observing toolkit shoutout (with sapphiRe)',
    ],
  },
] as const
