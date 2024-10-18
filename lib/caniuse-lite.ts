import { agents } from 'caniuse-lite'

export type EpochDate = number
export type Version = string
type UsageFloat = number

export type CanIUseAgentName =
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

export type AgentLiteStats = {
  usage_global: Record<Version, UsageFloat>
  prefix: string
  versions: Version[]
  browser: string
  release_date: Record<Version, EpochDate>
}

export type CanIUseLite = {
  agents: Record<CanIUseAgentName, AgentLiteStats>
}

const data: CanIUseLite = { agents }

export const getCanIUseLastUpdatedAt = (): number => {
  let latest = 0

  for (const name in agents) {
    const agentReleaseDates = agents[name as CanIUseAgentName]?.release_date || {}

    for (const key in agentReleaseDates) {
      if (latest < agentReleaseDates[key]) {
        latest = agentReleaseDates[key]
      }
    }
  }

  return latest
}

export default data
