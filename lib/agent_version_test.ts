import { assertEquals } from '@std/assert'
import { parse as parseSemVer } from '@std/semver'
import AgVer, { type AgentVersion } from './agent_version.ts'

const assertMultiEqual = (...values: Array<unknown>): boolean => {
  if (values.length < 2) return true
  const proto = values[0]
  return values.slice(1).every((value) => value === proto)
}

Deno.test('AgentVersion parse builds an AgentVersioncorrectly', () => {
  assertEquals(AgVer.parse('1'), { major: 1, minor: 0, patch: 0, build: [], parts: ['1'], prerelease: [] })
  assertEquals(AgVer.parse('1.2'), { major: 1, minor: 2, patch: 0, build: [], parts: ['1', '2'], prerelease: [] })
  assertEquals(AgVer.parse('1.2.3'), { major: 1, minor: 2, patch: 3, build: [], parts: ['1', '2', '3'], prerelease: [] })
  assertEquals(AgVer.parse('1.2.3.4'), { major: 1, minor: 2, patch: 4, build: ['3'], parts: ['1', '2', '3', '4'], prerelease: [] })
})

Deno.test('AgentVersion format respects the original specificity', () => {
  const partialAgVer = { major: 1, minor: 0, patch: 0, build: [], parts: ['1', '0'] } as AgentVersion
  assertEquals(AgVer.format(partialAgVer), '1.0')
})

Deno.test('AgentVersion format does not increase specificity', () => {
  const partialAgVer = { major: 1, minor: 0, patch: 0, build: [], parts: ['1', '0'] } as AgentVersion
  assertEquals(AgVer.format(partialAgVer, 4), '1.0')
})

Deno.test('AgentVersion format can reduce specificity', () => {
  const partialAgVer = { major: 1, minor: 2, patch: 4, build: ['3'], parts: ['1', '2', '3', '4'] } as AgentVersion
  assertEquals(AgVer.format(partialAgVer, 2), '1.2')
})

Deno.test('AgentVersion formatting a parsed value outputs the original value', () => {
  assertEquals(AgVer.format(AgVer.parse('5')), '5')
  assertEquals(AgVer.format(AgVer.parse('5.0')), '5.0')
  assertEquals(AgVer.format(AgVer.parse('5.1.1')), '5.1.1')
  assertEquals(AgVer.format(AgVer.parse('129.55.0.294')), '129.55.0.294')
})

Deno.test('AgentVersion is compatible with SemVer over three parts', () => {
  const candidate = '109.10.99'

  const agentVersion = AgVer.parse(candidate)
  const semanticVersion = parseSemVer(candidate)

  assertMultiEqual(109, agentVersion.major, semanticVersion.major)
  assertMultiEqual(10, agentVersion.minor, semanticVersion.minor)
  assertMultiEqual(99, agentVersion.patch, semanticVersion.patch)

  assertEquals(agentVersion.prerelease, semanticVersion.prerelease)

  assertMultiEqual([], agentVersion.build, semanticVersion.build)
})
