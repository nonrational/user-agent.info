#!/usr/bin/env deno

// caniuse-lite dates a release weeks after it ships. Chrome and Firefox publish stable dates ahead of time, so we read
// their schedules directly. The window reaches back far enough to cover what caniuse-lite hasn't dated yet, and forward
// through the beta, dev, and nightly channels.
const RECENT_MAJORS = 8

async function fetchJSON(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }
  return await response.json()
}

type Milestone = { mstone: number; stable_date: string }

const { mstones }: { mstones: Milestone[] } = await fetchJSON(
  `https://chromiumdash.appspot.com/fetch_milestone_schedule?offset=-${RECENT_MAJORS}&n=${RECENT_MAJORS * 2}`,
)
const chrome = Object.fromEntries(mstones.map((m) => [String(m.mstone), m.stable_date.slice(0, 10)]))

const released: Record<string, string> = await fetchJSON('https://product-details.mozilla.org/1.0/firefox_history_major_releases.json')
const { FIREFOX_NIGHTLY } = await fetchJSON('https://product-details.mozilla.org/1.0/firefox_versions.json')

const latestFirefox = Math.max(...Object.keys(released).map((v) => parseInt(v)))
const firefox = Object.fromEntries(
  Object.entries(released)
    .filter(([v]) => parseInt(v) > latestFirefox - RECENT_MAJORS)
    .map(([v, date]) => [v.replace(/\.0$/, ''), date]),
)

// product-details only dates releases that have shipped. Mozilla's release calendar dates the ones still on beta and nightly.
for (let major = latestFirefox + 1; major <= parseInt(FIREFOX_NIGHTLY); major++) {
  const { release } = await fetchJSON(`https://whattrainisitnow.com/api/release/schedule/?version=${major}`)
  firefox[String(major)] = release.slice(0, 10)
}

await Deno.writeTextFile(
  'data/release_schedules.ts',
  `type ReleaseSchedules = { asOf: string; chrome: Record<string, string>; firefox: Record<string, string> }
   const ReleaseSchedules: ReleaseSchedules = {
     asOf: "${new Date().toISOString()}",
     chrome: ${JSON.stringify(chrome, null, 2)},
     firefox: ${JSON.stringify(firefox, null, 2)},
   }; export default ReleaseSchedules`,
)
