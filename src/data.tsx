import type { ReactNode } from 'react'

export type Pitch = {
  content: ReactNode
  /** Used to pick the tallest size-guide pitch. */
  weight: number
}

const mail = 'mailto:dj@ingame.observer'
const x = 'https://x.com/priusOBS'
const liquid = 'https://liquipedia.net/valorant/Prius'

/** Soft to hard sell. Index DEFAULT_PITCH is the balanced middle. */
export const PITCHES: Pitch[] = [
  {
    weight: 48,
    content: <>So, yeah, I'm an esports observer. What of it?</>,
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
        I'm a freelance observer. I might be worth a try if you need one. My
        work is pretty clean but it might not be your thing. Have a look and see
        what you think.
      </>
    ),
  },
  {
    weight: 210,
    content: (
      <>
        I'm a freelance observer with some decent stage time under my belt. I
        can handle most things from online cups to Masters weeks. Drop me a line
        if you want to talk.
      </>
    ),
  },
  {
    weight: 280,
    content: (
      <>
        I'm prius. Freelance esports observer. I frame the fight so casters can
        cook and viewers don't miss the swing.{' '}
        <a href={liquid} target="_blank" rel="noopener noreferrer">
          15+ years in
        </a>
        , Challengers through Champions.
      </>
    ),
  },
  {
    weight: 340,
    content: (
      <>
        I'm prius. Freelance esports observer. I do the camera work that makes
        your cast land and your broadcast feel sharp. 15+ years, CS Majors,
        VALORANT's biggest stages, Emmy-winning Champions coverage. Challengers
        to international LANs.
      </>
    ),
  },
  {
    weight: 420,
    content: (
      <>
        I'm prius. Freelance esports observer. 15+ years across CS:GO, CS2, and
        VALORANT. Majors, Masters, and Champions on the resume, including a
        Sports Emmy win for Champions coverage after four nominations. Consulted
        for Riot Games. Partners include ESL FACEIT Group, BLAST, Turner Sports
        (TBS), and Raidiant.
      </>
    ),
  },
  {
    weight: 430,
    content: (
      <>
        <strong>Broadcast-ready observing for VALORANT and CS2.</strong>
        <br />
        I'm a freelance observer. 15+ years in the chair. Majors, Masters,
        Champions. Sports Emmy win for Champions coverage, four nominations
        total. Consulted for Riot Games. ESL FACEIT Group, BLAST, Turner Sports,
        and Raidiant keep booking me.
      </>
    ),
  },
  {
    weight: 400,
    content: (
      <>
        Want a broadcast that doesn't miss the swing?
        <br />
        15+ years of big-stage observing. Majors, Masters, Champions. Four
        Sports Emmy nominations, one win for Champions coverage. Consulted for
        Riot. ESL FACEIT Group, BLAST, Turner Sports, and Raidiant keep coming
        back. Get in touch.
      </>
    ),
  },
  {
    weight: 280,
    content: (
      <>
        <strong>Book me. Before the other production does.</strong>
        <br />
        15+ years. Four Sports Emmy nominations. One Emmy win for Champions
        coverage. CS Majors. VCT Masters. Riot consulting.{' '}
        <strong>Email me.</strong>
      </>
    ),
  },
  {
    weight: 380,
    content: (
      <>
        <strong className="red">
          The production you're pitching against could book me.
          <br />
          You want to take that risk?
        </strong>
        <br />
        <strong>GET IN TOUCH.</strong> 15+ years of big-stage observing. Majors,
        Masters, Champions. Four Sports Emmy nominations. One Emmy win.
        Consulted for Riot. VALORANT and CS2.
      </>
    ),
  },
  {
    weight: 420,
    content: (
      <>
        <strong className="red">
          THE PRODUCTION YOU'RE PITCHING AGAINST COULD BOOK ME.
          <br />
          YOU WANT TO TAKE THAT RISK?
        </strong>
        <br />
        <strong>
          GET IN TOUCH at <a href={mail}>dj@ingame.observer</a>
        </strong>
        . 15+ years. Four Sports Emmy nominations. Emmy winner. Majors,
        Masters, Champions. Consulted for Riot. VALORANT and CS2. Don't wait.
      </>
    ),
  },
  {
    weight: 480,
    content: (
      <>
        <strong className="red">
          THE PRODUCTION YOU'RE PITCHING AGAINST COULD BOOK ME.
          <br />
          YOU WANT TO TAKE THAT RISK?
        </strong>
        <br />
        <strong>
          GET IN TOUCH at <a href={mail}>dj@ingame.observer</a>
        </strong>
        . 15+ years. Four Sports Emmy nominations. Emmy winner. Consulted for
        Riot. Biggest VALORANT and CS2 stages. Beat your rivals to the booking.{' '}
        <strong className="red">
          <a href={mail}>Email me</a> or DM{' '}
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
  taglineRole: 'Freelance VALORANT & CS2 observer',
  taglineCreds: 'Sports Emmy winner — Los Angeles, California',
  availability: 'Booking international LANs & league stages · replies within 48h',
} as const

export const SITE_TAGLINE = `${SITE.taglineRole} · ${SITE.taglineCreds}`

export const PAGE_TITLES = {
  home: 'prius',
  cv: 'CV · prius',
  clips: 'Clips · prius',
  events: 'Events · prius',
  privacy: 'Privacy · prius',
  notfound: '404 · prius',
} as const

export const SOCIAL = {
  twitter: 'https://x.com/priusOBS',
  linkedin: 'https://www.linkedin.com/in/david-kuntz-3521847a',
  email: 'dj@ingame.observer',
  mailto: mail,
  location: 'Los Angeles, California',
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
