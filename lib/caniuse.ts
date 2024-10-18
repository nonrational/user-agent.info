type EpochDate = number
type Era = number
export type VersionStr = string
type PrefixException = Record<number, string>
type Categories = Record<string, Array<string>>

export type AgentKey =
  | 'and_chr'
  | 'and_ff'
  | 'and_qq'
  | 'and_uc'
  | 'android'
  | 'baidu'
  | 'bb'
  | 'chrome'
  | 'edge'
  | 'firefox'
  | 'ie_mob'
  | 'ie'
  | 'ios_saf'
  | 'kaios'
  | 'op_mini'
  | 'op_mob'
  | 'opera'
  | 'safari'
  | 'samsung'

export type AgentVersion = {
  version: VersionStr
  global_usage: number
  release_date: EpochDate
  era: Era
  prefix: string
}

export type Agent = {
  browser: string
  long_name: string
  abbr: string
  prefix: string
  type: string
  usage_global: Record<VersionStr, number>
  current_version: string
  version_list?: AgentVersion[]
  prefix_exception?: PrefixException
}

type StatusCode = 'rec' | 'pr' | 'cr' | 'wd' | 'ls' | 'other' | 'unoff'
type StatusDescription =
  | 'W3C Recommendation'
  | 'W3C Proposed Recommendation'
  | 'W3C Candidate Recommendation'
  | 'W3C Working Draft'
  | 'WHATWG Living Standard'
  | 'Other'
  | 'Unofficial / Note'

type FeatureKey = string
type SupportMatrix = object

export type CanIUseData2 = {
  agents: Record<AgentKey, Agent>
  statuses: Record<StatusCode, StatusDescription>
  cats: Categories
  updated: EpochDate
  data: Record<FeatureKey, SupportMatrix>
}

// import data from 'caniuse-db/fulldata-json/data-2.0.json' with { type: 'json' }
// export default data as CanIUseData2
