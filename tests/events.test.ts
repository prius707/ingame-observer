import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  EVENT_YEARS,
  eventTravelFlag,
  filterEventYears,
  recentEventYearFrom,
} from '../src/events.ts'

test('eventTravelFlag resolves cities, disambiguates Kraków qualifier, and omits US events', () => {
  assert.deepEqual(eventTravelFlag('VALORANT Champions Seoul', 2024), {
    code: 'kr',
    country: 'South Korea',
  })
  assert.deepEqual(eventTravelFlag('PGL Major Kraków Offline Qualifier', 2017), {
    code: 'ro',
    country: 'Romania',
  })
  assert.deepEqual(eventTravelFlag('PGL Major Kraków', 2017), {
    code: 'pl',
    country: 'Poland',
  })
  assert.deepEqual(eventTravelFlag('BLAST Premier Fall Finals', 2022), {
    code: 'dk',
    country: 'Denmark',
  })
  assert.deepEqual(eventTravelFlag('BLAST Premier Spring Finals', 2022), {
    code: 'pt',
    country: 'Portugal',
  })
  assert.equal(eventTravelFlag('VALORANT Champions Los Angeles', 2023), null)
})

test('filterEventYears filters by range, game, and Emmy status', () => {
  const now = new Date('2026-06-01T00:00:00Z')
  assert.equal(recentEventYearFrom(now), 2024)

  const recent = filterEventYears(EVENT_YEARS, {
    game: 'all',
    range: 'recent',
    emmyOnly: false,
    now,
  })
  assert.ok(recent.every((g) => g.year >= 2024))

  const csEmmy = filterEventYears(EVENT_YEARS, {
    game: 'CS',
    range: 'all',
    emmyOnly: true,
    now,
  })
  assert.equal(csEmmy.length, 1)
  assert.equal(csEmmy[0].year, 2022)
  assert.equal(csEmmy[0].events[0].name, 'BLAST Premier Fall Finals')

  const recentCsEmmy = filterEventYears(EVENT_YEARS, {
    game: 'CS',
    range: 'recent',
    emmyOnly: true,
    now,
  })
  assert.deepEqual(recentCsEmmy, [])
})
