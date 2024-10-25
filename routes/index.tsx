import type { FunctionalComponent } from 'preact'
import type { Handlers, PageProps } from '$fresh/server.ts'

import { type Agent, getAgentReleaseInfo } from '../lib/agent.ts'
import { formatDateYearMonth, humanizeDurationSince, randInterjection, toOrdinal } from '../lib/utils.ts'
import { getFamilyName, getGlobalUsageStats, getNorthAmericaUsageStats } from '../lib/family.ts'
import AgVer, { safeParseInt } from '../lib/agent_version.ts'
import UaInputSubmit from '../islands/ua_input_submit.tsx'
import type { UserAgent } from '$std/http/user_agent.ts'

export type KnownBrowserName = string

type HomeProps = PageProps & { data: RenderData }
type RenderData = { ua: string; source: 'query' | 'header' } & Agent

export const handler: Handlers = {
  GET(req, ctx) {
    const queryParamValue = new URL(req.url).searchParams?.get('ua')?.trim()
    const source = queryParamValue ? 'query' : 'header'
    const userAgentString = queryParamValue || req.headers.get('user-agent')

    if (!userAgentString) return ctx.renderNotFound()

    const data = { source, ua: userAgentString, ...getAgentReleaseInfo(userAgentString) }

    return ctx.render(data)
  },
}

const AgentIdentification = ({ ok, version, userAgent, name, source }: RenderData) => {
  return (
    <p>
      {!ok && (
        <>
          Hmm. That agent must still be undercover. <a href='/' class='underline'>Start over</a>.
        </>
      )}

      {ok && source === 'query' && <>That's</>}
      {ok && source === 'header' && <>Looks like you're using</>}
      {ok && (
        <>
          {' '}
          <strong>{name} {AgVer.tryFormat(version)}</strong> on <strong>{userAgent?.os.name}</strong>. {randInterjection()}.
        </>
      )}
    </p>
  )
}

const AgentReleaseAge = ({ name, version, releaseDate, asOf, currentVersion }: RenderData) => {
  if (!releaseDate?.date) {
    // if the agent version is beyond the current version, it's likely just been released.
    const veryRecent = (currentVersion && version) ? safeParseInt(currentVersion) < version.major : false

    // if the current date formatted matches the asOf date formatted, we're still in the same month, so use "in" not "after"
    const likelyReleased = formatDateYearMonth(asOf || new Date())
    const inOrAfter = formatDateYearMonth(new Date()) === likelyReleased

    return (
      <p>
        {veryRecent
          ? <>That version is brand new! It was likely released {inOrAfter ? 'in' : 'after'} {formatDateYearMonth(asOf || new Date())}.</>
          : <>That version is either very old or very new. That's all we know.</>}
      </p>
    )
  }

  return (
    <p>
      {name} {releaseDate.version} was released in {formatDateYearMonth(releaseDate.date)};{' '}
      <>it's {humanizeDurationSince(releaseDate.date)} old.</>
    </p>
  )
}

const AgentReleaseUsage = ({ userAgent, name, usage, rank, currentVersion }: RenderData) => {
  if (!userAgent || !usage) return null

  const hasSomeUsage = usage.percent > 0.000
  const major = userAgent?.browser.major

  if (!hasSomeUsage) {
    return <p>{name} {usage.version} has{usage.percent > 0 ? ' nearly' : ''} 0% usage worldwide.</p>
  }

  return (
    <p>
      {name} {usage?.version}
      {currentVersion === major && <>{' '}is the most recent major release{usage ? ' and' : '.'}</>} represents{' '}
      <strong>{usage.percent.toFixed(3)}%</strong> of global browser traffic.
      {rank && (
        <>
          {' '}
          It's currently the {rank.place > 1 && toOrdinal(rank.place)} most popular version of {name} (out of {rank.outOf}{' '}
          active versions) worldwide.
        </>
      )}
    </p>
  )
}

const AgentUsage = ({ name, deviceType, userAgent }: RenderData) => {
  if (!userAgent) return null

  const globalUsage = getGlobalUsageStats(userAgent.browser, userAgent.device)
  const americasUsage = getNorthAmericaUsageStats(userAgent.browser, userAgent.device)

  if (globalUsage < 0.01 && americasUsage < 0.01) return null

  return (
    <p>
      {name && deviceType && <>{getFamilyName(name)} on {deviceType} is used by{' '}</>}
      <strong>{americasUsage.toFixed(1)}</strong>% of North America and <strong>{globalUsage.toFixed(1)}%</strong> of the world.
    </p>
  )
}

// Because we're going to set innerHTML, only render
const FormattedUserAgent = ({ userAgent }: { userAgent?: UserAgent }) => {
  if (!userAgent) return null

  const uaParts = userAgent.ua.replace(/([A-z]+\/[0-9.]+)/g, '¶$1').split('¶')

  return (
    <code class='text-sm text-center'>
      {uaParts.map((part, index) => <div key={`ua-${index}`}>{part}</div>)}
    </code>
  )
}

const Home: FunctionalComponent<HomeProps> = ({ data }: PageProps) => {
  const { ok, ua, userAgent } = data as RenderData

  const inputValue = ok ? userAgent?.ua : ua

  return (
    <div class='container mx-auto flex flex-col items-center justify-center p-2'>
      <div class='font-bold mt-8 text-2xl md:text-4xl flex flex-row items-center justify-center gap-4'>
        <div>🕵️</div>
        <div>user-agent.info</div>
      </div>

      <div class='my-8 w-full lg:max-w-4xl'>
        <form method='GET' class='w-full'>
          <UaInputSubmit ok={ok} value={inputValue} />
        </form>
      </div>

      <div class='text-lg px-4 py-4 md:px-0 md:text-2xl lg:text-4xl'>
        <AgentIdentification {...data} />
      </div>

      {ok &&
        (
          <div class='text-md px-4 md:max-w-2xl'>
            <AgentReleaseAge {...data} />
            <AgentReleaseUsage {...data} />
            <AgentUsage {...data} />
          </div>
        )}

      <div class='mb-16'>
        <FormattedUserAgent userAgent={userAgent} />
      </div>
    </div>
  )
}

export default Home
