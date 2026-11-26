import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  assetPath,
  canonicalForView,
  clipPath,
  eventFlagSrc,
  eventPhotoSrc,
  httpsUrl,
  normalizePath,
  pathForView,
  usesClipHash,
  viewFromHash,
  viewFromLocation,
  viewFromPath,
} from '../src/paths.ts'

test('assetPath strips leading slash and blocks traversal or schemes', () => {
  assert.equal(assetPath(''), '/')
  assert.equal(assetPath('/favicon.gif'), '/favicon.gif')
  assert.equal(assetPath('clips/prius.mp4'), '/clips/prius.mp4')
  assert.equal(assetPath('../secret'), '/')
  assert.equal(assetPath('javascript:alert(1)'), '/')
  assert.equal(assetPath('//evil.example/x'), '/')
})

test('eventPhotoSrc and eventFlagSrc allow only safe same-origin assets', () => {
  assert.equal(eventPhotoSrc('event-photos/123.jpg'), '/event-photos/123.jpg')
  assert.equal(eventPhotoSrc('https://example.com/a.jpg'), null)
  assert.equal(eventPhotoSrc('event-photos/../a.jpg'), null)

  assert.equal(eventFlagSrc('de'), '/flags/de.svg')
  assert.equal(eventFlagSrc('DE'), null)
  assert.equal(eventFlagSrc('usa'), null)
})

test('httpsUrl allows only https URLs', () => {
  assert.equal(httpsUrl('https://flickr.com/photos/1'), 'https://flickr.com/photos/1')
  assert.equal(httpsUrl('http://flickr.com/photos/1'), null)
  assert.equal(httpsUrl('javascript:alert(1)'), null)
  assert.equal(httpsUrl('not-a-url'), null)
})

test('view routing normalizes paths and prioritizes known hashes', () => {
  assert.equal(normalizePath('/'), '/')
  assert.equal(normalizePath('/cv///'), '/cv')
  assert.equal(normalizePath('/index.html'), '/')

  assert.equal(viewFromPath('/'), 'home')
  assert.equal(viewFromPath('/cv/'), 'cv')
  assert.equal(viewFromPath('/awards'), 'events')
  assert.equal(viewFromPath('/clips/some-slug'), 'clips')
  assert.equal(viewFromPath('/nope'), 'notfound')

  assert.equal(viewFromHash('#events'), 'events')
  assert.equal(viewFromHash('#awards'), 'events')
  assert.equal(viewFromHash('#clips/foo'), 'clips')
  assert.equal(viewFromHash('#main'), null)

  assert.equal(
    viewFromLocation({ pathname: '/cv', hash: '#main' } as Location),
    'cv',
  )
  assert.equal(
    viewFromLocation({ pathname: '/', hash: '#events' } as Location),
    'events',
  )
})

test('canonicalForView and clip helpers build expected URLs', () => {
  assert.equal(pathForView('home'), '/')
  assert.equal(pathForView('events'), '/events')
  assert.equal(canonicalForView('home'), 'https://ingame.observer/')
  assert.equal(canonicalForView('cv'), 'https://ingame.observer/cv')
  assert.equal(canonicalForView('notfound'), 'https://ingame.observer/')
  assert.equal(
    canonicalForView('clips', 'abc'),
    'https://ingame.observer/clips/abc',
  )
  assert.equal(clipPath('abc'), '/clips/abc')
  assert.equal(usesClipHash({ hash: '#clips/abc' } as Location), true)
  assert.equal(usesClipHash({ hash: '#events' } as Location), false)
})
