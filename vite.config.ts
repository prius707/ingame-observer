import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { CLIPS } from './src/clipsData.ts'
import {
  PAGE_DESCRIPTIONS,
  PAGE_TITLES,
  PERSON_JSON_LD_TEXT,
  SPA_FOLDERS,
  clipPageMeta,
  type MetaView,
} from './src/siteMeta.ts'

const SITE = 'https://ingame.observer'

type RouteMeta = {
  title: string
  description: string
  canonical: string
  robots?: string
  image?: string
  imageAlt?: string
}

function metaForFolder(folder: string): RouteMeta {
  if (folder === 'awards') {
    return {
      title: PAGE_TITLES.events,
      description: PAGE_DESCRIPTIONS.events,
      canonical: `${SITE}/events`,
    }
  }
  const view = folder as MetaView
  return {
    title: PAGE_TITLES[view],
    description: PAGE_DESCRIPTIONS[view],
    canonical: `${SITE}/${folder}`,
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function replaceCaptured(
  html: string,
  pattern: RegExp,
  value: string,
): string {
  const escaped = escapeHtml(value).replace(/\$/g, '$$$$')
  return html.replace(pattern, `$1${escaped}$2`)
}

function applyPageMeta(html: string, meta: RouteMeta): string {
  let out = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`,
  )
  out = replaceCaptured(
    out,
    /(<meta\s+name="description"[\s\S]*?content=")[^"]*(")/,
    meta.description,
  )
  out = replaceCaptured(
    out,
    /(<meta\s+property="og:url"[\s\S]*?content=")[^"]*(")/,
    meta.canonical,
  )
  out = replaceCaptured(
    out,
    /(<meta\s+property="og:title"[\s\S]*?content=")[^"]*(")/,
    meta.title,
  )
  out = replaceCaptured(
    out,
    /(<meta\s+property="og:description"[\s\S]*?content=")[^"]*(")/,
    meta.description,
  )
  out = replaceCaptured(
    out,
    /(<meta\s+name="twitter:title"[\s\S]*?content=")[^"]*(")/,
    meta.title,
  )
  out = replaceCaptured(
    out,
    /(<meta\s+name="twitter:description"[\s\S]*?content=")[^"]*(")/,
    meta.description,
  )
  out = replaceCaptured(
    out,
    /(<link\s+rel="canonical"[\s\S]*?href=")[^"]*(")/,
    meta.canonical,
  )
  if (meta.image) {
    out = replaceCaptured(
      out,
      /(<meta\s+property="og:image"[\s\S]*?content=")[^"]*(")/,
      meta.image,
    )
    out = replaceCaptured(
      out,
      /(<meta\s+name="twitter:image"[\s\S]*?content=")[^"]*(")/,
      meta.image,
    )
    out = out.replace(/\s*<meta\s+property="og:image:(?:width|height)"[^>]*>/g, '')
  }
  if (meta.imageAlt) {
    out = replaceCaptured(
      out,
      /(<meta\s+property="og:image:alt"[\s\S]*?content=")[^"]*(")/,
      meta.imageAlt,
    )
    out = replaceCaptured(
      out,
      /(<meta\s+name="twitter:image:alt"[\s\S]*?content=")[^"]*(")/,
      meta.imageAlt,
    )
  }
  if (meta.robots && !/name="robots"/.test(out)) {
    out = out.replace(
      '</head>',
      `    <meta name="robots" content="${escapeHtml(meta.robots)}" />\n  </head>`,
    )
  }
  return out
}

function writeSitemap(dist: string, clipSlugs: string[]) {
  const locs = [
    `${SITE}/`,
    `${SITE}/cv`,
    `${SITE}/clips`,
    `${SITE}/events`,
    `${SITE}/contact`,
    `${SITE}/privacy`,
    ...clipSlugs.map((slug) => `${SITE}/clips/${encodeURIComponent(slug)}`),
  ]
  const body = locs
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
    .join('\n')
  fs.writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
  )
}

/**
 * Inject static Person JSON-LD into HTML and emit static route HTML files +
 * 404.html + sitemap.xml so GitHub Pages serves clean URLs with 200 OK.
 */
function spaStaticPages(): Plugin {
  return {
    name: 'spa-static-pages',
    transformIndexHtml(html) {
      if (html.includes('application/ld+json')) return html
      const safeJson = PERSON_JSON_LD_TEXT.replace(/</g, '\\u003c')
      return html.replace(
        '</head>',
        `    <script type="application/ld+json">${safeJson}</script>\n  </head>`,
      )
    },
    closeBundle() {
      const dist = path.resolve('dist')
      const index = path.join(dist, 'index.html')
      if (!fs.existsSync(index)) return
      const html = fs.readFileSync(index, 'utf8')

      fs.writeFileSync(
        path.join(dist, '404.html'),
        applyPageMeta(html, {
          title: PAGE_TITLES.notfound,
          description: PAGE_DESCRIPTIONS.notfound,
          canonical: `${SITE}/`,
          robots: 'noindex',
        }),
      )

      for (const folder of SPA_FOLDERS) {
        const meta = metaForFolder(folder)
        if (folder === 'clips') {
          const dir = path.join(dist, 'clips')
          fs.mkdirSync(dir, { recursive: true })
          fs.writeFileSync(path.join(dir, 'index.html'), applyPageMeta(html, meta))
        } else {
          // Extensionless HTML file lets GitHub Pages serve /cv, /events, etc.
          // directly with 200 OK instead of a 301 redirect to /cv/.
          fs.writeFileSync(
            path.join(dist, `${folder}.html`),
            applyPageMeta(html, meta),
          )
        }
      }

      const clipsDir = path.join(dist, 'clips')
      fs.mkdirSync(clipsDir, { recursive: true })
      for (const clip of CLIPS) {
        const { title, description } = clipPageMeta(clip)
        fs.writeFileSync(
          path.join(clipsDir, `${clip.slug}.html`),
          applyPageMeta(html, {
            title,
            description,
            canonical: `${SITE}/clips/${encodeURIComponent(clip.slug)}`,
            image: `${SITE}/clips/${clip.file}.jpg`,
            imageAlt: `${clip.title} — ${clip.note}`,
          }),
        )
      }

      writeSitemap(
        dist,
        CLIPS.map((c) => c.slug),
      )
    },
  }
}

/** Custom domain: https://ingame.observer/ */
export default defineConfig({
  base: '/',
  plugins: [react(), spaStaticPages()],
})
