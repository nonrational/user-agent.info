#!/usr/bin/env deno

import { WEEK } from '$std/datetime/mod.ts'

import { parse } from '@std/csv'

async function fetchCSV(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText}`)
  }
  return await response.text()
}

const to = new Date()
const from = new Date(to.getTime() - 4 * WEEK)

const fromTo = {
  fromInt: from.getUTCFullYear() * 100 + from.getUTCMonth() + 1,
  toInt: to.getUTCFullYear() * 100 + to.getUTCMonth() + 1,
  fromMonthYear: `${from.getUTCFullYear()}-${String(from.getUTCMonth() + 1).padStart(2, '0')}`,
  toMonthYear: `${to.getUTCFullYear()}-${String(to.getUTCMonth() + 1).padStart(2, '0')}`,
}

type FetchOpts = {
  statType: 'Browser' | 'Browser Version'
  device: 'Desktop' | 'Mobile' | 'Tablet'
  region: 'Worldwide' | 'North America'
  region_hidden: 'ww' | 'na'
  fromInt: number
  toInt: number
  fromMonthYear: string
  toMonthYear: string
}

const fetchStats = async (opts: FetchOpts) => {
  const statCounterQueryParams = {
    bar: 1,
    multi_device: true,
    granularity: 'monthly',
    statType_hidden: opts.statType.toLowerCase().replace(' ', '_'),
    csv: 1,
    device_hidden: opts.device.toLowerCase(),
    ...opts,
  }

  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(statCounterQueryParams).map(([key, value]) => [key, String(value)]),
    ),
  ).toString()

  const csvUrl = `https://gs.statcounter.com/chart.php?${params}`

  const csvBody = await fetchCSV(csvUrl)
  const csvData = parse(csvBody)

  return csvData.slice(1).reduce((acc: Record<string, number>, row: Array<string>) => {
    acc[row[0]] = parseFloat(row[1])
    return acc
  }, {})
}

// StatCounter labels versions "<Family> <version>" and writes whole majors as "151.0". Dropping the trailing ".0" matches
// caniuse-lite's keys and lets a lookup for "153.0.0.0" fall back to "153".
const groupByFamily = (shares: Record<string, number>) => {
  const families: Record<string, Record<string, number>> = {}

  for (const [label, share] of Object.entries(shares)) {
    // Skips unversioned rows such as "Chrome for Android", "Safari iPhone", and "Other".
    const match = label.match(/^(.+) (\d+(?:\.\d+)*)$/)
    if (!match) continue

    const [, family, version] = match
    families[family] ??= {}
    families[family][version.replace(/\.0$/, '')] = share
  }

  return families
}

const browser = { statType: 'Browser', ...fromTo } as const
const desktop_ww = await fetchStats({ ...browser, device: 'Desktop', region: 'Worldwide', region_hidden: 'ww' })
const desktop_na = await fetchStats({ ...browser, device: 'Desktop', region: 'North America', region_hidden: 'na' })
const mobile_ww = await fetchStats({ ...browser, device: 'Mobile', region: 'Worldwide', region_hidden: 'ww' })
const mobile_na = await fetchStats({ ...browser, device: 'Mobile', region: 'North America', region_hidden: 'na' })

const version = { statType: 'Browser Version', region: 'Worldwide', region_hidden: 'ww', ...fromTo } as const
const desktop_versions_ww = groupByFamily(await fetchStats({ ...version, device: 'Desktop' }))
const mobile_versions_ww = groupByFamily(await fetchStats({ ...version, device: 'Mobile' }))
// Nearly all mobile Chrome traffic lands in the unversioned "Chrome for Android" and "Chrome for iPhone" rows. The few
// versioned "Chrome" rows left over would badly understate any mobile Chrome version, so defer to caniuse-lite instead.
delete mobile_versions_ww['Chrome']

await Deno.writeTextFile(
  'data/statscounter.ts',
  `type RegionalDeviceStatProps = { asOf: string; ww: { desktop: Record<string, number>; mobile: Record<string, number> }; na: { desktop: Record<string, number>; mobile: Record<string, number> } }
   const UsageStats: RegionalDeviceStatProps = {
     asOf: "${to.toISOString()}",
     ww: { desktop: ${JSON.stringify(desktop_ww, null, 2)}, mobile:  ${JSON.stringify(mobile_ww, null, 2)} },
     na: { desktop: ${JSON.stringify(desktop_na, null, 2)}, mobile:  ${JSON.stringify(mobile_na, null, 2)} },
   }; export default UsageStats`,
)

await Deno.writeTextFile(
  'data/statscounter_versions.ts',
  `type DeviceVersionStatProps = { asOf: string; ww: { desktop: Record<string, Record<string, number>>; mobile: Record<string, Record<string, number>> } }
   const VersionStats: DeviceVersionStatProps = {
     asOf: "${to.toISOString()}",
     ww: { desktop: ${JSON.stringify(desktop_versions_ww, null, 2)}, mobile: ${JSON.stringify(mobile_versions_ww, null, 2)} },
   }; export default VersionStats`,
)
