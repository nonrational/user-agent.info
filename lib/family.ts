import type { Browser, Device } from '$std/http/user_agent.ts'
import statscounter from '../data/statscounter.ts'

const BROWSER_FAMILIES: Record<string, string> = {
  'Chrome': 'Chrome',
  'Mobile Chrome': 'Chrome',
  'DuckDuckGo': 'Chrome',

  'Firefox': 'Firefox',
  'Mobile Firefox': 'Firefox',

  'Safari': 'Safari',
  'Mobile Safari': 'Safari',

  'IE': 'IE',
  'Edge': 'Edge',

  'Opera': 'Opera',
  'Opera Mini': 'Opera Mini',

  'QQ Browser': 'QQ Browser',
  'UC': 'UC Browser',
  'Samsung Internet': 'Samsung Internet',
}

export const getFamilyName = (name: string): string => BROWSER_FAMILIES[name]

// https://github.com/denoland/std/pull/6129
type FixedDeviceType = Device['type'] | 'tablet' | 'smarttv'

export const getGlobalUsageStats = (browser: Browser, device: Device): number => {
  if (browser?.name === undefined || browser.name === 'Unknown') return 0

  const usageKey = getFamilyName(browser.name)

  switch (device.type as FixedDeviceType) {
    case undefined:
      return statscounter.ww.desktop[usageKey] ?? 0
    case 'mobile':
      return statscounter.ww.mobile[usageKey] ?? 0
    default:
      return 0
  }
}

export const getNorthAmericaUsageStats = (browser: Browser, device: Device): number => {
  if (browser?.name === undefined || browser.name === 'Unknown') return 0

  const usageKey = getFamilyName(browser.name)

  switch (device.type as FixedDeviceType) {
    case undefined:
      return statscounter.na.desktop[usageKey] ?? 0
    case 'mobile':
      return statscounter.na.mobile[usageKey] ?? 0
    default:
      return 0
  }
}
