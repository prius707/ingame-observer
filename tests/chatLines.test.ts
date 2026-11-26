import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CHAT_EMOTES, CHAT_LINES, emoteSrc, parseChatText } from '../src/chatLines.ts'

test('parseChatText splits known emotes and leaves unknown tokens as plain text', () => {
  assert.deepEqual(parseChatText('PRIUs COOKED :PRIUS: :Clap:'), [
    { type: 'text', value: 'PRIUs COOKED ' },
    { type: 'emote', name: 'PRIUS' },
    { type: 'text', value: ' ' },
    { type: 'emote', name: 'Clap' },
  ])
  assert.deepEqual(parseChatText('unknown :NotAnEmote: ok'), [
    { type: 'text', value: 'unknown ' },
    { type: 'text', value: ':NotAnEmote:' },
    { type: 'text', value: ' ok' },
  ])
})

test('emoteSrc builds local webp path and all configured emotes are used', () => {
  assert.equal(emoteSrc('PRIUS'), '/emotes/PRIUS.webp')
  const used = new Set(
    CHAT_LINES.flatMap((line) =>
      parseChatText(line.text)
        .filter((p) => p.type === 'emote')
        .map((p) => p.name),
    ),
  )
  for (const emote of CHAT_EMOTES) {
    assert.ok(used.has(emote), `unused emote: ${emote}`)
  }
})

test('all chat username colors meet WCAG AA contrast (>= 4.5:1) on pure black', () => {
  const relLum = (hex: string) => {
    const ch = [1, 3, 5].map((i) => {
      const s = parseInt(hex.slice(i, i + 2), 16) / 255
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
  }
  for (const line of CHAT_LINES) {
    const ratio = (relLum(line.color) + 0.05) / 0.05
    assert.ok(
      ratio >= 4.5,
      `${line.user} (${line.color}) contrast ${ratio.toFixed(2)}:1 < 4.5:1`,
    )
  }
})
