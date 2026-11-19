import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseSavedPitch } from '../src/sliderPos.ts'

test('accepts a whole-number position inside the pitch list', () => {
  assert.equal(parseSavedPitch('0', 5), 0)
  assert.equal(parseSavedPitch('4', 5), 4)
})

test('rejects fractional positions (used to crash the page)', () => {
  assert.equal(parseSavedPitch('1.5', 5), null)
  assert.equal(parseSavedPitch('0.0001', 5), null)
})

test('rejects out-of-range, empty and junk values', () => {
  for (const v of [null, '', ' ', '-1', '5', '99', 'abc', 'NaN', 'Infinity', '1e3']) {
    assert.equal(parseSavedPitch(v, 5), null, String(v))
  }
})
