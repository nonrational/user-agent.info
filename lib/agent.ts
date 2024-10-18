import caniuse_lite, { type AgentLiteStats, type CanIUseAgentName, getCanIUseLastUpdatedAt, type Version } from './caniuse-lite.ts'

import { UserAgent } from '$std/http/user_agent.ts'
import { debug, epochToDate } from './utils.ts'
import { getFamilyName } from './family.ts'
import AgVer, { type AgentVersion } from './agent_version.ts'

type ReleaseDate = { date?: Date; version?: string }
type Rank = { place: number; outOf: number; version?: string }
type Usage = { percent: number; version?: string }

export type Agent = {
  ok: boolean
  deviceType?: 'desktop' | 'mobile' | 'tablet'
  userAgent?: UserAgent
  version?: AgentVersion
  name?: string
  familyName?: string
  releaseDate?: ReleaseDate
  currentVersion?: Version
  usage?: Usage
  rank?: Rank
  asOf?: Date
}

const CANIUSE_AGENT_NAMES: Record<string, CanIUseAgentName> = {
  'Chrome': 'chrome',
  'Mobile Firefox': 'and_ff',
  'Mobile Chrome': 'and_chr',
  'DuckDuckGo': 'chrome',
  'Edge': 'edge',
  'Firefox': 'firefox',
  'IE': 'ie',
  'Opera': 'opera',
  'Opera Mini': 'op_mini',
  'QQ Browser': 'and_qq',
  'Safari': 'safari',
  'Mobile Safari': 'ios_saf',
  'Samsung Internet': 'samsung',
  'UC': 'and_uc',
}

// Consider adding a way to detect browsers that have funky or unexpected user agents.
// const USER_AGENT_OVERRIDES: Record<string, string> = {
//   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36': 'Arc',
// }

// This function will generate quad, triple, double, and single part versions to find the most specific usage data available
// as different agents specify usage data with different specificities.
// caniuse-lite provides usage data for <major>, <major.minor> versions and, sometimes, <major.minor>-<major.minor> ranges.
const findMostSpecificVersionValue = (fn: (test: string) => number | undefined, version: AgentVersion) => {
  let needle: string | undefined = undefined
  let value: number | undefined = undefined

  for (let i = 4; i > 0 && (value === undefined || value < 0); i--) {
    needle = AgVer.format(version, i)
    value = fn(needle)
    debug('findValueForVersion attempt', { needle, value })
  }

  return { value, needle }
}

const getFixedDeviceType = (ua: UserAgent): 'desktop' | 'mobile' | 'tablet' | undefined => {
  if (ua.device?.type === 'table') return 'tablet'
  if (ua.device?.type === 'mobile') return 'mobile'
  if (ua.device?.type === undefined) return 'desktop'

  return undefined
}

const getCurrentVersion = (stats: AgentLiteStats): Version | undefined => {
  return Object.entries(stats.release_date)
    .filter(([_, date]) => date !== null)
    .sort(([, dateA], [, dateB]) => dateB - dateA)[0][0]
}

/*
 * Get get the ranking of a version in
 */
const getVersionRank = (stats: AgentLiteStats, version?: AgentVersion): Rank | undefined => {
  if (!version) return undefined

  const ranked = Object.entries(stats.usage_global)
    .filter(([_, usage]) => usage && usage > 0)
    .sort(([, usageA], [, usageB]) => usageB - usageA)

  const { value, needle } = findMostSpecificVersionValue((tv: string) => ranked.findIndex(([v]) => v === tv), version)

  return typeof value !== 'number' || value === -1 ? undefined : { place: value + 1, version: needle, outOf: ranked.length }
}

const getVersionReleaseDate = (stats: AgentLiteStats, version?: AgentVersion): ReleaseDate | undefined => {
  if (!version) return undefined
  // TODO(@nonrational): Provide support for checking whether a range matches the given version.
  const { value, needle } = findMostSpecificVersionValue((tv: string) => stats.release_date[tv], version)
  return typeof value === 'number' ? { date: epochToDate(value), version: needle } : undefined
}

const getGlobalVersionUsage = (stats: AgentLiteStats, version?: AgentVersion): Usage | undefined => {
  if (!version) return undefined
  // TODO(@nonrational): Provide support for checking whether a range matches the given version.
  const { value, needle } = findMostSpecificVersionValue((tv: string) => stats.usage_global[tv], version)
  return typeof value === 'number' ? { percent: value, version: needle } : undefined
}

export const getAgentReleaseInfo = (ua: string): Agent => {
  const userAgent = new UserAgent(ua)

  const name = userAgent.browser?.name
  const version = userAgent.browser?.version

  if (name === undefined || name === 'Unknown') return { ok: false }

  const caniuseAgentName = CANIUSE_AGENT_NAMES[name]
  const manifestVersion = version ? AgVer.parse(version) : undefined

  // On deploy, we cache the most recently released browser date to prevent the need to recalculate it on every request
  // If the env doesn't have a value set, we'll fetch it at runtime.
  const envAsOf = Deno.env.get('CANIUSE_AS_OF_EPOCH')
  const asOfEpoch = envAsOf ? parseInt(envAsOf) : getCanIUseLastUpdatedAt()

  const thinResponse = {
    ok: true,
    // TODO(@nonrational): This should probably live inside each object, so we set separate expectations for release date lookups, usage, and rank can be.
    asOf: epochToDate(asOfEpoch),
    userAgent,
    name,
    version: manifestVersion,
    familyName: getFamilyName(name),
    deviceType: getFixedDeviceType(userAgent),
  }

  const stats = caniuse_lite.agents[caniuseAgentName || '']

  if (stats === undefined) {
    console.warn(`getAgentReleaseInfo: caniuse-lite data not found for '${name}'`)
    return thinResponse
  }

  const result: Agent = {
    ...thinResponse,
    currentVersion: getCurrentVersion(stats),
    releaseDate: getVersionReleaseDate(stats, manifestVersion),
    usage: getGlobalVersionUsage(stats, manifestVersion),
    rank: getVersionRank(stats, manifestVersion),
  }

  debug('getAgentReleaseInfo result', result)

  return result
}
