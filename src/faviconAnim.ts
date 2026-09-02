import { assetPath } from './paths'

const FRAME_COUNT = 21
/** Match the source GIF (~15fps / ~66ms average delay). */
const FRAME_MS = 66

function frameHref(index1Based: number) {
  const n = String(index1Based).padStart(3, '0')
  return assetPath(`favicon-frames/frame-${n}.png`)
}

/**
 * Chrome/Edge/Safari only show the first frame of a GIF favicon.
 * Cycle PNG frames so the 7TV observer emote still animates there.
 * Firefox already animates `favicon.gif` — leave it alone.
 */
export function startFaviconAnimation() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (/firefox/i.test(navigator.userAgent)) return

  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) return

  let frame = 1
  let timer = 0

  const paint = () => {
    link.type = 'image/png'
    link.sizes = 'any'
    link.href = frameHref(frame)
    frame = frame >= FRAME_COUNT ? 1 : frame + 1
  }

  const start = () => {
    if (timer) return
    paint()
    timer = window.setInterval(paint, FRAME_MS)
  }

  const stop = () => {
    if (!timer) return
    window.clearInterval(timer)
    timer = 0
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop()
    else start()
  })

  start()
}
