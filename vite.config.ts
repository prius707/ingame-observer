import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import {
  PAGE_DESCRIPTIONS,
  PAGE_TITLES,
  SPA_FOLDERS,
  type MetaView,
} from './src/siteMeta.ts'

const SITE = 'https://ingame.observer'

type RouteMeta = {
  title: string
  description: string
  canonical: string
  robots?: string
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

function applyPageMeta(html: string, meta: RouteMeta): string {
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
  out = out.replace(
    /(<meta\s+name="description"[\s\S]*?content=")[^"]*(")/,
    `$1${meta.description}$2`,
  )
  out = out.replace(
    /(<meta\s+property="og:url"[\s\S]*?content=")[^"]*(")/,
    `$1${meta.canonical}$2`,
  )
  out = out.replace(
    /(<meta\s+property="og:title"[\s\S]*?content=")[^"]*(")/,
    `$1${meta.title}$2`,
  )
  out = out.replace(
    /(<meta\s+property="og:description"[\s\S]*?content=")[^"]*(")/,
    `$1${meta.description}$2`,
  )
  out = out.replace(
    /(<meta\s+name="twitter:title"[\s\S]*?content=")[^"]*(")/,
    `$1${meta.title}$2`,
  )
  out = out.replace(
    /(<meta\s+name="twitter:description"[\s\S]*?content=")[^"]*(")/,
    `$1${meta.description}$2`,
  )
  out = out.replace(
    /(<link\s+rel="canonical"[\s\S]*?href=")[^"]*(")/,
    `$1${meta.canonical}$2`,
  )
  if (meta.robots && !/name="robots"/.test(out)) {
    out = out.replace(
      '</head>',
      `    <meta name="robots" content="${meta.robots}" />\n  </head>`,
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
    ...clipSlugs.map((slug) => `${SITE}/clips/${slug}`),
  ]
  const body = locs
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
    .join('\n')
  fs.writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
  )
}

/** Copy index → 404.html and real path folders so GitHub Pages returns 200. */
function spaFallback404(): Plugin {
  return {
    name: 'spa-fallback-404',
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
        const dir = path.join(dist, folder)
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(
          path.join(dir, 'index.html'),
          applyPageMeta(html, metaForFolder(folder)),
        )
      }

      const clipsSrc = fs.readFileSync(path.resolve('src/clips.ts'), 'utf8')
      const slugs = [...clipsSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
      for (const slug of slugs) {
        const dir = path.join(dist, 'clips', slug)
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(
          path.join(dir, 'index.html'),
          applyPageMeta(html, {
            title: PAGE_TITLES.clips,
            description: PAGE_DESCRIPTIONS.clips,
            canonical: `${SITE}/clips/${encodeURIComponent(slug)}`,
          }),
        )
      }

      writeSitemap(dist, slugs)
    },
  }
}

/** Custom domain: https://ingame.observer/ */
export default defineConfig({
  base: '/',
  plugins: [react(), spaFallback404()],
})
