import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  CLIPS,
  clipIndexFromSlug,
  clipPageUrl,
  clipPoster,
  clipQuoteRepeatsTitle,
  clipSrc,
  parseClipSlugFromLocation,
} from '../src/clips.ts'

test('clipSrc, clipPoster, and clipPageUrl validate inputs', () => {
  assert.equal(clipSrc('prius'), '/clips/prius.mp4')
  assert.equal(clipPoster('prius'), '/clips/prius.jpg')
  assert.equal(clipSrc('../evil'), '')
  assert.equal(clipPoster('a/b'), '')

  assert.equal(
    clipPageUrl(CLIPS[0].slug),
    `https://clips.twitch.tv/${CLIPS[0].slug}`,
  )
  assert.equal(clipPageUrl('bad/slug'), null)
})

test('parseClipSlugFromLocation accepts only known slugs from path, hash, or query', () => {
  const first = CLIPS[0].slug
  const second = CLIPS[1].slug

  assert.equal(
    parseClipSlugFromLocation({
      pathname: `/clips/${first}`,
      hash: '',
      search: '',
    } as Location),
    first,
  )
  assert.equal(
    parseClipSlugFromLocation({
      pathname: '/',
      hash: `#clips/${second}`,
      search: '',
    } as Location),
    second,
  )
  assert.equal(
    parseClipSlugFromLocation({
      pathname: '/clips',
      hash: '',
      search: `?clip=${first}`,
    } as Location),
    first,
  )
  assert.equal(
    parseClipSlugFromLocation({
      pathname: '/clips/unknown-slug',
      hash: '',
      search: '',
    } as Location),
    null,
  )
  assert.equal(
    parseClipSlugFromLocation({
      pathname: '/clips/%E0%A4%A',
      hash: '',
      search: '',
    } as Location),
    null,
  )
  assert.equal(clipIndexFromSlug(first), 0)
  assert.equal(clipIndexFromSlug('missing'), -1)
})

test('clipQuoteRepeatsTitle ignores case and punctuation', () => {
  assert.equal(
    clipQuoteRepeatsTitle({
      slug: 's',
      file: 'f',
      title: 'PRIUS',
      note: 'Tarik',
      quote: 'PRIUS.',
    }),
    true,
  )
  assert.equal(
    clipQuoteRepeatsTitle({
      slug: 's',
      file: 'f',
      title: 'Press a button',
      note: 'Sliggy',
      quote: 'Mate, press a button.',
    }),
    false,
  )
})
