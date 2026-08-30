/** Major events observed + organizer stills where albums match. */
export type EventPhoto = {
  id: string
  title: string
  views: number
  imageUrl: string
  pageUrl: string
  license: string
  albumId: string
  credit?: string
}

export type EventEntry = {
  name: string
  game: 'VALORANT' | 'CS'
  albumTitle?: string
  photo?: EventPhoto
  /** Sports Emmy — Outstanding Esports Championship Coverage */
  emmy?: 'winner' | 'nominated'
  /** Ceremony year when emmy is "winner" (event year may differ). */
  emmyAwardYear?: number
}

export type EventYear = { year: number; events: EventEntry[] }

/** Country flags for travel venues — matched from city/region in the event name. */
const PLACE_FLAGS: ReadonlyArray<{ match: RegExp; flag: string }> = [
  { match: /Toronto/i, flag: '🇨🇦' },
  { match: /Santiago/i, flag: '🇨🇱' },
  { match: /S[aã]o Paulo/i, flag: '🇧🇷' },
  { match: /Belo Horizonte/i, flag: '🇧🇷' },
  { match: /London/i, flag: '🇬🇧' },
  { match: /Berlin/i, flag: '🇩🇪' },
  { match: /Cologne/i, flag: '🇩🇪' },
  { match: /Paris/i, flag: '🇫🇷' },
  { match: /Madrid/i, flag: '🇪🇸' },
  { match: /Lisbon/i, flag: '🇵🇹' },
  { match: /Copenhagen/i, flag: '🇩🇰' },
  { match: /Reykjav[ií]k/i, flag: '🇮🇸' },
  { match: /Katowice/i, flag: '🇵🇱' },
  { match: /Krak[oó]w/i, flag: '🇵🇱' },
  { match: /Moscow/i, flag: '🇷🇺' },
  { match: /Istanbul/i, flag: '🇹🇷' },
  { match: /Bangkok/i, flag: '🇹🇭' },
  { match: /Shanghai/i, flag: '🇨🇳' },
  { match: /Seoul/i, flag: '🇰🇷' },
  { match: /Tokyo/i, flag: '🇯🇵' },
  { match: /Sydney/i, flag: '🇦🇺' },
]

/** Known venues when the event title has no city (US events intentionally unflagged). */
const NAMED_EVENT_FLAGS: ReadonlyArray<{ match: RegExp; flag: string }> = [
  { match: /^IEM World Championship$/i, flag: '🇵🇱' }, // Katowice
  { match: /^VALORANT Champions$/i, flag: '🇩🇪' }, // Berlin 2021
  { match: /^VALORANT Game Changers Championship$/i, flag: '🇩🇪' },
  { match: /^Red Bull Home Ground/i, flag: '🇩🇪' },
  { match: /^VCT LOCK\/\//i, flag: '🇧🇷' },
]

/** BLAST Premier titles without a city — venue by season year. Online events omitted. */
function blastPremierFlag(name: string, year: number): string | null {
  if (!/^BLAST Premier\b/i.test(name)) return null
  if (/Fall Finals?/i.test(name)) {
    if (year === 2021 || year === 2022) return '🇩🇰' // Copenhagen
  }
  if (/Spring Finals?/i.test(name)) {
    if (year === 2022) return '🇵🇹' // Lisbon
  }
  if (/World Final/i.test(name) && year === 2021) return '🇩🇰' // Copenhagen
  return null
}

/** Flag emoji for where the event was held, or null if unknown / online. */
export function eventTravelFlag(name: string, year?: number): string | null {
  for (const { match, flag } of PLACE_FLAGS) {
    if (match.test(name)) return flag
  }
  if (year != null) {
    const blast = blastPremierFlag(name, year)
    if (blast) return blast
  }
  for (const { match, flag } of NAMED_EVENT_FLAGS) {
    if (match.test(name)) return flag
  }
  return null
}

export const FLICKR_CREDIT = "VALORANT Champions Tour Photos / Riot Games" as const
export const FLICKR_OWNER_URL = "https://www.flickr.com/photos/valorantesports/" as const
export const AMERICAS_FLICKR_CREDIT = "VCT Americas Photos / Riot Games" as const
export const AMERICAS_FLICKR_OWNER_URL = "https://www.flickr.com/photos/vctamericas/" as const
export const FLICKR_NOTE = "International VALORANT photos credited to VALORANT Champions Tour Photos (valorantesports); Americas Kickoff / Stage photos credited to VCT Americas (vctamericas). CS and other event stills credited to organizer galleries where available (BLAST Esports, ESL FACEIT Group, PGL, StarLadder, MTG AB, and event photographers). Stills shown on this site are self-hosted copies; attribution links go to the original albums. Prefer finals / celebration stills when captions mark them. All photos remain \u00a9 their respective rights holders; All Rights Reserved unless otherwise licensed." as const

export const EVENT_YEARS: EventYear[] = [
  {
    "year": 2026,
    "events": [
      {
        "name": "VALORANT Masters London",
        "game": "VALORANT",
        "albumTitle": "VALORANT Masters London Grand Finals",
        "photo": {
          "id": "55348356897",
          "title": "2026 VALORANT Masters London Grand Finals",
          "views": 7855,
          "imageUrl": "event-photos/55348356897.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/55348356897/",
          "license": "All Rights Reserved",
          "albumId": "72177720334325513"
        }
      },
      {
        "name": "VALORANT Masters Santiago",
        "game": "VALORANT",
        "albumTitle": "VALORANT Masters Santiago - Grand Finals",
        "photo": {
          "id": "55150210232",
          "title": "VALORANT Masters Santiago - Grand Finals",
          "views": 16704,
          "imageUrl": "event-photos/55150210232.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/55150210232/",
          "license": "All Rights Reserved",
          "albumId": "72177720332556428"
        }
      },
      {
        "name": "VCT Americas Stage 2",
        "game": "VALORANT",
        "photo": {
          "id": "55494987420",
          "title": "VCT Americas 2026 Stage 2 Playoffs Day 2",
          "views": 31,
          "imageUrl": "event-photos/55494987420.jpg",
          "pageUrl": "https://www.flickr.com/photos/vctamericas/55494987420/",
          "license": "All Rights Reserved",
          "albumId": "72177720335350721",
          "credit": "VCT Americas Photos / Riot Games"
        }
      },
      {
        "name": "VCT Americas Stage 1",
        "game": "VALORANT",
        "albumTitle": "VCT Americas 2026 Stage 1 Finals",
        "photo": {
          "id": "55291754913",
          "title": "VCT Americas 2026 Stage 1 Finals",
          "views": 5781,
          "imageUrl": "event-photos/55291754913.jpg",
          "pageUrl": "https://www.flickr.com/photos/vctamericas/55291754913/",
          "license": "All Rights Reserved",
          "albumId": "72177720333830445"
        }
      },
      {
        "name": "VCT Americas Kickoff",
        "game": "VALORANT",
        "albumTitle": "VCT Americas 2026 Kickoff Day 15",
        "photo": {
          "id": "55098468598",
          "title": "VCT Americas 2026 Kickoff Day 15",
          "views": 7284,
          "imageUrl": "event-photos/55098468598.jpg",
          "pageUrl": "https://www.flickr.com/photos/vctamericas/55098468598/",
          "license": "All Rights Reserved",
          "albumId": "72177720332036292"
        }
      }
    ]
  },
  {
    "year": 2025,
    "events": [
      {
        "name": "VALORANT Champions Paris",
        "game": "VALORANT",
        "emmy": "nominated",
        "albumTitle": "VALORANT Champions Paris Grand Finals",
        "photo": {
          "id": "54833446232",
          "title": "VALORANT Champions Paris Grand Finals",
          "views": 18845,
          "imageUrl": "event-photos/54833446232.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/54833446232/",
          "license": "All Rights Reserved",
          "albumId": "72177720329466707"
        }
      },
      {
        "name": "VALORANT Masters Toronto",
        "game": "VALORANT",
        "albumTitle": "VALORANT Masters Toronto Grand Finals",
        "photo": {
          "id": "54607435631",
          "title": "VALORANT Masters Toronto Grand Finals",
          "views": 30053,
          "imageUrl": "event-photos/54607435631.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/54607435631/",
          "license": "All Rights Reserved",
          "albumId": "72177720327026060"
        }
      },
      {
        "name": "VALORANT Masters Bangkok",
        "game": "VALORANT",
        "albumTitle": "VALORANT Masters Bangkok - Grand Finals",
        "photo": {
          "id": "54359662567",
          "title": "VALORANT Masters Bangkok - Grand Finals",
          "views": 33101,
          "imageUrl": "event-photos/54359662567.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/54359662567/",
          "license": "All Rights Reserved",
          "albumId": "72177720324158815"
        }
      },
      {
        "name": "Red Bull Home Ground",
        "game": "VALORANT",
        "photo": {
          "id": "54987140393",
          "title": "Showmatch - Red Bull Home Ground 2025",
          "views": 52,
          "imageUrl": "event-photos/54987140393.jpg",
          "pageUrl": "https://www.flickr.com/photos/152807917@N03/54987140393/",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "Cloud9gg"
        }
      },
      {
        "name": "VCT Americas Stage 2",
        "game": "VALORANT",
        "albumTitle": "2025 VCT Americas Stage 2 Grand Finals",
        "photo": {
          "id": "54757532681",
          "title": "2025 VCT Americas Stage 2 - Grand Finals",
          "views": 8916,
          "imageUrl": "event-photos/54757532681.jpg",
          "pageUrl": "https://www.flickr.com/photos/vctamericas/54757532681/",
          "license": "All Rights Reserved",
          "albumId": "72177720328724856"
        }
      },
      {
        "name": "VCT Americas Stage 1",
        "game": "VALORANT",
        "albumTitle": "2025 VCT Americas Stage 1 - Grand Final",
        "photo": {
          "id": "54497573144",
          "title": "2025 VCT Americas Stage 1 - Grand Final",
          "views": 7852,
          "imageUrl": "event-photos/54497573144.jpg",
          "pageUrl": "https://www.flickr.com/photos/vctamericas/54497573144/",
          "license": "All Rights Reserved",
          "albumId": "72177720325866292"
        }
      },
      {
        "name": "VCT Americas Kickoff",
        "game": "VALORANT",
        "albumTitle": "2025 VCT Americas Kickoff - Grand Finals",
        "photo": {
          "id": "54315577061",
          "title": "2025 VCT Americas Kickoff - Grand Finals",
          "views": 7969,
          "imageUrl": "event-photos/54315577061.jpg",
          "pageUrl": "https://www.flickr.com/photos/vctamericas/54315577061/",
          "license": "All Rights Reserved",
          "albumId": "72177720323694252"
        }
      }
    ]
  },
  {
    "year": 2024,
    "events": [
      {
        "name": "VALORANT Champions Seoul",
        "game": "VALORANT",
        "emmy": "winner",
        "emmyAwardYear": 2025,
        "albumTitle": "VALORANT Champions Seoul Grand Finals",
        "photo": {
          "id": "53946817988",
          "title": "VALORANT Champions Seoul Grand Finals",
          "views": 38655,
          "imageUrl": "event-photos/53946817988.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/53946817988/",
          "license": "All Rights Reserved",
          "albumId": "72177720319751205"
        }
      },
      {
        "name": "VALORANT Masters Shanghai",
        "game": "VALORANT",
        "albumTitle": "VALORANT Masters Shanghai Grand Finals",
        "photo": {
          "id": "53779777489",
          "title": "VALORANT Masters Shanghai Grand Finals",
          "views": 35573,
          "imageUrl": "event-photos/53779777489.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/53779777489/",
          "license": "All Rights Reserved",
          "albumId": "72177720317739976"
        }
      },
      {
        "name": "VALORANT Masters Madrid",
        "game": "VALORANT",
        "albumTitle": "VALORANT Masters Madrid Grand Finals",
        "photo": {
          "id": "53608901921",
          "title": "VALORANT Masters Madrid Grand Finals",
          "views": 20412,
          "imageUrl": "event-photos/53608901921.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/53608901921/",
          "license": "All Rights Reserved",
          "albumId": "72177720315665604"
        }
      },
      {
        "name": "VCT Americas Stage 2",
        "game": "VALORANT",
        "albumTitle": "2024 VCT Americas Season Finals",
        "photo": {
          "id": "53872876155",
          "title": "2024 VCT Americas Season Finals",
          "views": 9320,
          "imageUrl": "event-photos/53872876155.jpg",
          "pageUrl": "https://www.flickr.com/photos/vctamericas/53872876155/",
          "license": "All Rights Reserved",
          "albumId": "72177720319004616"
        }
      },
      {
        "name": "VCT Americas Stage 1",
        "game": "VALORANT",
        "albumTitle": "2024 VCT Americas Mid-Season Finals - Day 5",
        "photo": {
          "id": "53716114357",
          "title": "2024 VCT Americas Mid-Season Finals - Day 5",
          "views": 6889,
          "imageUrl": "event-photos/53716114357.jpg",
          "pageUrl": "https://www.flickr.com/photos/vctamericas/53716114357/",
          "license": "All Rights Reserved",
          "albumId": "72177720316900585"
        }
      },
      {
        "name": "VCT Americas Kickoff",
        "game": "VALORANT",
        "albumTitle": "2024 VCT Americas Kickoff Week 3 - Finals",
        "photo": {
          "id": "53566811240",
          "title": "2024 VCT Americas Kickoff Week 3 - Day 2",
          "views": 6387,
          "imageUrl": "event-photos/53566811240.jpg",
          "pageUrl": "https://www.flickr.com/photos/vctamericas/53566811240/",
          "license": "All Rights Reserved",
          "albumId": "72177720315205520"
        }
      }
    ]
  },
  {
    "year": 2023,
    "events": [
      {
        "name": "VALORANT Champions Los Angeles",
        "game": "VALORANT",
        "emmy": "nominated",
        "albumTitle": "VALORANT Champions Los Angeles - GRAND FINALS",
        "photo": {
          "id": "53143669355",
          "title": "VALORANT Champions Los Angeles - Grand Finals",
          "views": 42291,
          "imageUrl": "event-photos/53143669355.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/53143669355/",
          "license": "All Rights Reserved",
          "albumId": "72177720310763308"
        }
      },
      {
        "name": "VALORANT Masters Tokyo",
        "game": "VALORANT",
        "albumTitle": "VALORANT Masters Tokyo 2023 - Grand Finals",
        "photo": {
          "id": "52999744386",
          "title": "VALORANT Masters Tokyo 2023 - Grand Finals",
          "views": 39357,
          "imageUrl": "event-photos/52999744386.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/52999744386/",
          "license": "All Rights Reserved",
          "albumId": "72177720309301565"
        }
      },
      {
        "name": "VCT LOCK//IN S\u00e3o Paulo",
        "game": "VALORANT",
        "albumTitle": "VCT 2023: LOCK//IN - Finals Day",
        "photo": {
          "id": "52726542454",
          "title": "VALORANT Champions Tour 2023: LOCK//IN - Finals",
          "views": 39567,
          "imageUrl": "event-photos/52726542454.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/52726542454/",
          "license": "All Rights Reserved",
          "albumId": "72177720306456297"
        }
      },
      {
        "name": "VCT Americas League",
        "game": "VALORANT",
        "albumTitle": "VCT Americas Grand Finals 2023",
        "photo": {
          "id": "52933357996",
          "title": "VCT Americas 2023 Grand Finals",
          "views": 7559,
          "imageUrl": "event-photos/52933357996.jpg",
          "pageUrl": "https://www.flickr.com/photos/vctamericas/52933357996/",
          "license": "All Rights Reserved",
          "albumId": "72177720308631991"
        }
      },
      {
        "name": "Red Bull Home Ground #4",
        "game": "VALORANT",
        "photo": {
          "id": "53395201139",
          "title": "FNATIC At Red Bull Home Ground",
          "views": 385,
          "imageUrl": "event-photos/53395201139.jpg",
          "pageUrl": "https://www.flickr.com/photos/188442132@N07/53395201139/",
          "license": "All Rights Reserved",
          "albumId": "72177720313358038",
          "credit": "Davard_"
        }
      }
    ]
  },
  {
    "year": 2022,
    "events": [
      {
        "name": "VALORANT Champions Istanbul",
        "game": "VALORANT",
        "emmy": "nominated",
        "albumTitle": "VALORANT Champions 2022: Grand Finals Day 18",
        "photo": {
          "id": "52367661118",
          "title": "VALORANT Champions 2022 Istanbul: Grand Finals Stage",
          "views": 29868,
          "imageUrl": "event-photos/52367661118.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/52367661118/",
          "license": "All Rights Reserved",
          "albumId": "72177720302192084"
        }
      },
      {
        "name": "VALORANT Masters Copenhagen",
        "game": "VALORANT",
        "albumTitle": "VALORANT Masters 2 - 2022: Grand Finals",
        "photo": {
          "id": "52237852277",
          "title": "VALORANT Champions Tour: Stage 2 Masters Grand Finals",
          "views": 27124,
          "imageUrl": "event-photos/52237852277.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/52237852277/",
          "license": "All Rights Reserved",
          "albumId": "72177720300775351"
        }
      },
      {
        "name": "VALORANT Masters Reykjav\u00edk",
        "game": "VALORANT",
        "albumTitle": "VALORANT Masters 2022: Grand Finals",
        "photo": {
          "id": "52027332531",
          "title": "Valorant_Finals_2022_154",
          "views": 27658,
          "imageUrl": "event-photos/52027332531.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/52027332531/",
          "license": "All Rights Reserved",
          "albumId": "72177720298357508"
        }
      },
      {
        "name": "VALORANT Game Changers Championship",
        "game": "VALORANT",
        "albumTitle": "VALORANT Game Changers Championship 2022 - Finals",
        "photo": {
          "id": "52512483584",
          "title": "VALORANT Game Changers Championship 2022 - Finals Stage",
          "views": 31825,
          "imageUrl": "event-photos/52512483584.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/52512483584/",
          "license": "All Rights Reserved",
          "albumId": "72177720303848909"
        }
      },
      {
        "name": "BLAST Premier Fall Finals",
        "game": "CS",
        "emmy": "nominated",
        "photo": {
          "id": "54212770799",
          "title": "20221123_Michal_Konkol_D1_BLASTPremiereSeries2022-2",
          "views": 3639,
          "imageUrl": "event-photos/54212770799.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54212770799/",
          "license": "All Rights Reserved",
          "albumId": "72177720322645920",
          "credit": "BLAST Esports"
        }
      },
      {
        "name": "BLAST Premier Spring Finals",
        "game": "CS",
        "photo": {
          "id": "54210813965",
          "title": "20220619-JoaoFerreira@itsmeERROR_BLAST-Spring-Finals-Lisbon_A7400301",
          "views": 3298,
          "imageUrl": "event-photos/54210813965.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54210813965/",
          "license": "All Rights Reserved",
          "albumId": "72177720322625041",
          "credit": "BLAST Esports"
        }
      }
    ]
  },
  {
    "year": 2021,
    "events": [
      {
        "name": "VALORANT Champions",
        "game": "VALORANT",
        "albumTitle": "VALORANT Champions Tour 2021: Champions - Finals",
        "photo": {
          "id": "51743257579",
          "title": "Acend, Santeri \"BONECOLD\" Sassi , Mehmet Yagiz \"cNed\" \u0130pek, Vladyslav \"Kiles\" Shvets, Patryk \"starxo\" Kopczynski, Aleksander \"zeek\" Zygmunt, Laurynas \"Nbs\" Kisielius",
          "views": 28928,
          "imageUrl": "event-photos/51743257579.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/51743257579/",
          "license": "All Rights Reserved",
          "albumId": "72157720227334063"
        }
      },
      {
        "name": "VALORANT Masters Berlin",
        "game": "VALORANT",
        "albumTitle": "VALORANT Champions Tour 2021: Stage 3 Masters Grand Finals",
        "photo": {
          "id": "51492568452",
          "title": "Gambit Esports, Timofey \"Chronicle\" Khromov, Nikita \"d3ffo\" Sudakov, Bogdan \"Sheydos\" Naumov, Ayaz \"nAts\" Akhmetshin, Igor \"Redgar\" Vlasov",
          "views": 24109,
          "imageUrl": "event-photos/51492568452.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/51492568452/",
          "license": "All Rights Reserved",
          "albumId": "72157719874077256"
        }
      },
      {
        "name": "VALORANT Masters Reykjav\u00edk",
        "game": "VALORANT",
        "albumTitle": "VALORANT Stage 2 Masters - Grand Finals",
        "photo": {
          "id": "51213659596",
          "title": "Sentinels",
          "views": 29200,
          "imageUrl": "event-photos/51213659596.jpg",
          "pageUrl": "https://www.flickr.com/photos/valorantesports/51213659596/",
          "license": "All Rights Reserved",
          "albumId": "72157719307428031"
        }
      },
      {
        "name": "BLAST Premier World Final",
        "game": "CS",
        "photo": {
          "id": "54210199714",
          "title": "IMG_9932",
          "views": 79,
          "imageUrl": "event-photos/54210199714.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54210199714/",
          "license": "All Rights Reserved",
          "albumId": "72177720322622052",
          "credit": "BLAST Esports"
        }
      },
      {
        "name": "BLAST Premier Fall Finals",
        "game": "CS",
        "photo": {
          "id": "54208724315",
          "title": "20211129_Stephanie-Lindgren_BLASTProSeries2021_07203",
          "views": 3137,
          "imageUrl": "event-photos/54208724315.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54208724315/",
          "license": "All Rights Reserved",
          "albumId": "72177720322524982",
          "credit": "BLAST Esports"
        }
      },
      {
        "name": "BLAST Premier Spring Finals",
        "game": "CS"
      }
    ]
  },
  {
    "year": 2020,
    "events": [
      {
        "name": "BLAST Premier Fall",
        "game": "CS"
      },
      {
        "name": "Flashpoint Season 2",
        "game": "CS"
      },
      {
        "name": "Flashpoint Season 1",
        "game": "CS"
      },
      {
        "name": "BLAST Premier Spring Finals",
        "game": "CS",
        "photo": {
          "id": "54199629219",
          "title": "Copy of 20200202_Jak-Howard_BLAST-Premier-London_08635",
          "views": 89,
          "imageUrl": "event-photos/54199629219.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54199629219/",
          "license": "All Rights Reserved",
          "albumId": "72177720322521316",
          "credit": "BLAST Esports"
        }
      }
    ]
  },
  {
    "year": 2019,
    "events": [
      {
        "name": "IEM Katowice Major",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "CS:GO Major Championship",
          "views": 0,
          "imageUrl": "event-photos/20190303_Adela-Sznajder_IEM-Katowice_19287-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2019/Intel-Extreme-Masters/Intel-Extreme-Masters-Katowice-2019/CSGO-Major-Championship",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "IEM Sydney",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "Intel Extreme Masters Sydney 2019",
          "views": 0,
          "imageUrl": "event-photos/20190503_Sarah-Cooper_IEM-Sydney_03552-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2019/Intel-Extreme-Masters/Intel-Extreme-Masters-Sydney-2019",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "ESL Pro League Season 10 Americas",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "ESL Pro League Season 10",
          "views": 0,
          "imageUrl": "event-photos/20191113_Jak-Howard_ESL-Pro-League-EU_06465-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2019/ESL-Pro-League/ESL-Pro-League-Season-10",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "ESL Pro League Season 9 Americas",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "ESL Pro League Season 9",
          "views": 0,
          "imageUrl": "event-photos/20190521_Graeme-Duncan_ESL-Pro-League-Season-9-Europe_08906-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2019/ESL-Pro-League/ESL-Pro-League-Season-9",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "BLAST Pro Series Los Angeles",
        "game": "CS",
        "photo": {
          "id": "54192308467",
          "title": "EricAnanmalay_RFRSH_BlastProSeriesLA-333",
          "views": 2514,
          "imageUrl": "event-photos/54192308467.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54192308467/",
          "license": "All Rights Reserved",
          "albumId": "72177720322455896",
          "credit": "BLAST Esports"
        }
      },
      {
        "name": "BLAST Pro Series Copenhagen",
        "game": "CS",
        "photo": {
          "id": "54199755330",
          "title": "191101_Stephanie-Lindgren_BLASTProSeriesCPH_00231",
          "views": 66,
          "imageUrl": "event-photos/54199755330.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54199755330/",
          "license": "All Rights Reserved",
          "albumId": "72177720322540494",
          "credit": "BLAST Esports"
        }
      },
      {
        "name": "BLAST Pro Series Moscow",
        "game": "CS",
        "photo": {
          "id": "54194700507",
          "title": "BLASTMoscow190914@Kirill_photos4592",
          "views": 2574,
          "imageUrl": "event-photos/54194700507.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54194700507/",
          "license": "All Rights Reserved",
          "albumId": "72177720322500294",
          "credit": "BLAST Esports"
        }
      },
      {
        "name": "BLAST Pro Series Madrid",
        "game": "CS",
        "photo": {
          "id": "54178839320",
          "title": "20190511_Joao-Ferreira_BLASTMadrid_04159-2",
          "views": 48,
          "imageUrl": "event-photos/54178839320.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54178839320/",
          "license": "All Rights Reserved",
          "albumId": "72177720322318168",
          "credit": "BLAST Esports"
        }
      },
      {
        "name": "BLAST Pro Series S\u00e3o Paulo",
        "game": "CS",
        "photo": {
          "id": "54198493227",
          "title": "1D5_8252",
          "views": 2252,
          "imageUrl": "event-photos/54198493227.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54198493227/",
          "license": "All Rights Reserved",
          "albumId": "72177720322457792",
          "credit": "BLAST Esports"
        }
      }
    ]
  },
  {
    "year": 2018,
    "events": [
      {
        "name": "ELEAGUE Major Boston",
        "game": "CS",
        "photo": {
          "id": "39703558925",
          "title": "Major Trophy 5",
          "views": 132,
          "imageUrl": "event-photos/39703558925.jpg",
          "pageUrl": "https://www.flickr.com/photos/martiesports/39703558925/",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "martiesports"
        }
      },
      {
        "name": "ELEAGUE Premier",
        "game": "CS"
      },
      {
        "name": "ESL One Cologne",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "ESL One Cologne 2018",
          "views": 0,
          "imageUrl": "event-photos/20180708_Helena-Kristiansson_ESL-One_Cologne_06205-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2018/ESL-One/ESL-One-Cologne-2018",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "ESL One Belo Horizonte",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "ESL One Belo Horizonte 2018",
          "views": 0,
          "imageUrl": "event-photos/20180616_Helena-Kristiansson_ESL-One_BeloHorizonte_03165-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2018/ESL-One/ESL-One-Belo-Horizonte-2018",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "IEM Sydney",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "Intel Extreme Masters Sydney 2018",
          "views": 0,
          "imageUrl": "event-photos/20180504-_Sarah-Cooper_IEM-Sydney_04513-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2018/Intel-Extreme-Masters/Intel-Extreme-Masters-Sydney-2018",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "IEM World Championship",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "Intel Extreme Masters Katowice 2018",
          "views": 0,
          "imageUrl": "event-photos/20180302_Helena-Kristiansson_IEM-Katowice_02842-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2018/Intel-Extreme-Masters/Intel-Extreme-Masters-Katowice-2018",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "IEM Chicago",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "Intel Extreme Masters Chicago 2018",
          "views": 0,
          "imageUrl": "event-photos/20181110_Helena-Kristiansson_IEM-Chicago_02729-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2018/Intel-Extreme-Masters/Intel-Extreme-Masters-Chicago-2018",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "BLAST Pro Series Lisbon",
        "game": "CS",
        "photo": {
          "id": "54133099330",
          "title": "151218-Kirill_Photos-221639-3",
          "views": 2093,
          "imageUrl": "event-photos/54133099330.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54133099330/",
          "license": "All Rights Reserved",
          "albumId": "72177720321878599",
          "credit": "BLAST Esports"
        }
      },
      {
        "name": "BLAST Pro Series Copenhagen",
        "game": "CS",
        "photo": {
          "id": "54132847854",
          "title": "20181103_Maciej-Kolek_BLAST_Copenhagen_Saturday_-1833",
          "views": 48,
          "imageUrl": "event-photos/54132847854.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54132847854/",
          "license": "All Rights Reserved",
          "albumId": "72177720321859305",
          "credit": "BLAST Esports"
        }
      },
      {
        "name": "BLAST Pro Series Istanbul",
        "game": "CS",
        "photo": {
          "id": "54139290512",
          "title": "20180929_Maciej-Kolek_BLAST_Istambul_Saturday_Tournament-0696",
          "views": 1828,
          "imageUrl": "event-photos/54139290512.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54139290512/",
          "license": "All Rights Reserved",
          "albumId": "72177720321952514",
          "credit": "BLAST Esports"
        }
      }
    ]
  },
  {
    "year": 2017,
    "events": [
      {
        "name": "PGL Major Krak\u00f3w",
        "game": "CS",
        "photo": {
          "id": "35303765503",
          "title": "PGL Major - Main Event",
          "views": 5287,
          "imageUrl": "event-photos/35303765503.jpg",
          "pageUrl": "https://www.flickr.com/photos/pglesports/35303765503/",
          "license": "All Rights Reserved",
          "albumId": "72157686564796436",
          "credit": "PGL"
        }
      },
      {
        "name": "ELEAGUE Major Atlanta",
        "game": "CS",
        "photo": {
          "id": "31746833523",
          "title": "ELEAGUE Major Atlanta broadcast desk",
          "views": 385,
          "imageUrl": "event-photos/31746833523.jpg",
          "pageUrl": "https://www.flickr.com/photos/starladder/31746833523/",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "StarLadder"
        }
      },
      {
        "name": "ESL One Cologne",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "ESL One Cologne",
          "views": 0,
          "imageUrl": "event-photos/20170709_Adela-Sznajder_ESL-One_Cologne_00880-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2017/ESL-One/ESL-One-Cologne",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "ESL One New York",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "ESL One New York",
          "views": 0,
          "imageUrl": "event-photos/20170917_Helena-Kristiansson_ESL-One_NY_03614-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2017/ESL-One/ESL-One-New-York",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "ESL Pro League Season 5 Finals",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "ESL Pro League Season 5 Finals Dallas",
          "views": 0,
          "imageUrl": "event-photos/20170603_Helena-Kristiansson_EPL-Dallas_03034-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2017/ESL-Pro-League/ESL-Pro-League-Season-5-Finals",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "IEM World Championship",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "CS:GO Playoffs",
          "views": 0,
          "imageUrl": "event-photos/i-j7pBh5p-L.jpg",
          "pageUrl": "https://photos.eslgaming.com/2017/Intel-Extreme-Masters/IEM-World-Championships-Katowice-2017/CSGO/CSGO-Playoffs",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "IEM Oakland",
        "game": "CS",
        "photo": {
          "id": "",
          "title": "IEM Oakland 2017",
          "views": 0,
          "imageUrl": "event-photos/20171119_Helena-Kristiansson_IEM-Oakland_03780-XL.jpg",
          "pageUrl": "https://photos.eslgaming.com/2017/Intel-Extreme-Masters/IEM-Oakland-2017",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "ESL FACEIT Group"
        }
      },
      {
        "name": "BLAST Pro Series Copenhagen",
        "game": "CS",
        "photo": {
          "id": "54132736164",
          "title": "BLAST 129",
          "views": 1825,
          "imageUrl": "event-photos/54132736164.jpg",
          "pageUrl": "https://www.flickr.com/photos/blastesports/54132736164/",
          "license": "All Rights Reserved",
          "albumId": "72177720321857477",
          "credit": "BLAST Esports"
        }
      }
    ]
  },
  {
    "year": 2016,
    "events": [
      {
        "name": "ELEAGUE Season 2",
        "game": "CS"
      },
      {
        "name": "ELEAGUE Season 1",
        "game": "CS",
        "photo": {
          "id": "28231913012",
          "title": "Last last chance match. #eleague",
          "views": 181,
          "imageUrl": "event-photos/28231913012.jpg",
          "pageUrl": "https://www.flickr.com/photos/bump/28231913012/",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "Robert Occhialini / bump"
        }
      },
      {
        "name": "ESL One New York",
        "game": "CS",
        "photo": {
          "id": "31854102320",
          "title": "ESL One New York 2016",
          "views": 1352,
          "imageUrl": "event-photos/31854102320.jpg",
          "pageUrl": "https://www.flickr.com/photos/moderntimesgroup/31854102320/",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "Modern Times Group MTG AB"
        }
      },
      {
        "name": "ESL Pro League Season 4 Finals",
        "game": "CS"
      },
      {
        "name": "IEM Oakland",
        "game": "CS",
        "photo": {
          "id": "38988529704",
          "title": "IEM OAKLAND 2016",
          "views": 1074,
          "imageUrl": "event-photos/38988529704.jpg",
          "pageUrl": "https://www.flickr.com/photos/damnielle/38988529704/",
          "license": "All Rights Reserved",
          "albumId": "",
          "credit": "Damnielle"
        }
      }
    ]
  }
]
