import { assertEquals } from 'jsr:@std/assert'
import { getAgentReleaseInfo } from './agent.ts'

Deno.test('getAgentReleaseInfo - Chrome 91', () => {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  const actual = getAgentReleaseInfo(userAgent)
  assertEquals(actual.userAgent?.browser?.name, 'Chrome')
  assertEquals(actual.userAgent?.browser?.version, '91.0.4472.124')
  // This test will break as caniuse-lite is updated over time ¯\_(ツ)_/¯
  assertEquals(actual.usage, { percent: 0.053745, version: '91' })
})

Deno.test('getAgentReleaseInfo - Chrome 129', () => {
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
  const actual = getAgentReleaseInfo(userAgent)
  assertEquals(actual.userAgent?.browser?.name, 'Chrome')
  assertEquals(actual.userAgent?.browser?.version, '129.0.0.0')
  // This test will break as caniuse-lite is updated over time ¯\_(ツ)_/¯
  assertEquals(actual.usage, { percent: 0.014332, version: '129' })
})

Deno.test('getAgentReleaseInfo - Firefox 89', () => {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
  const actual = getAgentReleaseInfo(userAgent)
  assertEquals(actual.userAgent?.browser?.name, 'Firefox')
  assertEquals(actual.userAgent?.browser?.version, '89.0')
  assertEquals(actual.usage, { percent: 0, version: '89' })
})

// TODO(@nonrational): Dynamically build tests for all the user agents in /data
