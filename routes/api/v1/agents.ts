import type { FreshContext } from '$fresh/server.ts'
import { getAgentReleaseInfo } from '../../../lib/agent.ts'

export const handler = (req: Request, _ctx: FreshContext) => {
  const ua = new URL(req.url).searchParams?.get('ua')?.trim() || req.headers.get('user-agent')?.trim()

  if (!ua) return new Response('Missing User-Agent', { status: 400 })

  const data = getAgentReleaseInfo(ua)
  const body = JSON.stringify(data)

  return new Response(body, {
    headers: { 'Content-Type': 'application/json' },
  })
}
