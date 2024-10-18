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
    statType: 'Browser',
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

const desktop_ww = await fetchStats({ device: 'Desktop', region: 'Worldwide', region_hidden: 'ww', ...fromTo })
const desktop_na = await fetchStats({ device: 'Desktop', region: 'North America', region_hidden: 'na', ...fromTo })
const mobile_ww = await fetchStats({ device: 'Mobile', region: 'Worldwide', region_hidden: 'ww', ...fromTo })
const mobile_na = await fetchStats({ device: 'Mobile', region: 'North America', region_hidden: 'na', ...fromTo })

await Deno.writeTextFile(
  'data/statscounter.ts',
  `type RegionalDeviceStatProps = { asOf: string; ww: { desktop: Record<string, number>; mobile: Record<string, number> }; na: { desktop: Record<string, number>; mobile: Record<string, number> } }
   const UsageStats: RegionalDeviceStatProps = {
     asOf: "${to.toISOString()}",
     ww: { desktop: ${JSON.stringify(desktop_ww, null, 2)}, mobile:  ${JSON.stringify(mobile_ww, null, 2)} },
     na: { desktop: ${JSON.stringify(desktop_na, null, 2)}, mobile:  ${JSON.stringify(mobile_na, null, 2)} },
   }; export default UsageStats`,
)
