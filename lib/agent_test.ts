import { assert, assertEquals } from '@std/assert'
import { getAgentReleaseInfo } from './agent.ts'
import caniuse_lite from './caniuse-lite.ts'

Deno.test('getAgentReleaseInfo - Chrome 91', () => {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  const actual = getAgentReleaseInfo(userAgent)
  assertEquals(actual.userAgent?.browser?.name, 'Chrome')
  assertEquals(actual.userAgent?.browser?.version, '91.0.4472.124')

  assert(actual.usage?.percent !== undefined)
  assertEquals(actual.usage?.version, '91')
})

Deno.test('getAgentReleaseInfo - Opera', () => {
  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 OPR/110.0.0.0'
  const actual = getAgentReleaseInfo(userAgent)
  assertEquals(actual.userAgent?.browser?.name, 'Opera')
  assertEquals(actual.userAgent?.browser?.version, '110.0.0.0')
  assertEquals(actual.usage, { percent: 0, version: '110' })
})

Deno.test('getAgentReleaseInfo - Chrome 129', () => {
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
  const actual = getAgentReleaseInfo(userAgent)
  assertEquals(actual.userAgent?.browser?.name, 'Chrome')
  assertEquals(actual.userAgent?.browser?.version, '129.0.0.0')

  assert(actual.usage?.percent !== undefined)
  assertEquals(actual.usage?.version, '129')
})

Deno.test('getAgentReleaseInfo - Firefox 89', () => {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
  const actual = getAgentReleaseInfo(userAgent)
  assertEquals(actual.userAgent?.browser?.name, 'Firefox')
  assertEquals(actual.userAgent?.browser?.version, '89.0')
  assertEquals(actual.usage, { percent: 0, version: '89' })
})

Deno.test('getAgentReleaseInfo - Chrome 153 uses StatCounter share before caniuse-lite catches up', () => {
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36'
  const actual = getAgentReleaseInfo(userAgent)
  assertEquals(actual.usage?.version, '153')
  assertEquals(actual.usage?.device, 'desktop')
  assert(actual.usage!.percent > 0)
  assert(actual.rank !== undefined)
})

Deno.test('getAgentReleaseInfo - Mobile Chrome falls back to caniuse-lite', () => {
  // caniuse-lite only lists the current Android Chrome version, and CI resolves the newest caniuse-lite release, so the
  // version under test has to come from the data rather than a literal.
  const [version] = Object.entries(caniuse_lite.agents.and_chr.usage_global).sort(([, a], [, b]) => b - a)[0]
  const userAgent = `Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.0.0 Mobile Safari/537.36`
  const actual = getAgentReleaseInfo(userAgent)
  assertEquals(actual.name, 'Mobile Chrome')
  assertEquals(actual.usage?.device, undefined)
  assert(actual.usage!.percent > 0)
})

Deno.test('getAgentReleaseInfo - Chrome 153 takes its release date from the Chromium schedule', () => {
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36'
  const actual = getAgentReleaseInfo(userAgent)
  assertEquals(actual.releaseDate?.version, '153')
  assertEquals(actual.releaseDate?.date?.toISOString().slice(0, 10), '2026-09-08')
})

Deno.test('getAgentReleaseInfo - current version has already shipped', () => {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
  const { currentVersion } = getAgentReleaseInfo(userAgent)
  const current = getAgentReleaseInfo(
    `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${currentVersion}.0) Gecko/20100101 Firefox/${currentVersion}.0`,
  )
  assert(current.releaseDate!.date! <= new Date())
})

// TODO(@nonrational): Dynamically build tests for all the user agents in /data
