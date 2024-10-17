import type { Handlers, PageProps } from "$fresh/server.ts"
import { UserAgent } from "$std/http/user_agent.ts"
import type { FunctionalComponent } from "preact"
import type { BrowserName, ReleaseDate } from "../fixtures/releases.ts"
import { getReleaseInfo, isKnownBrowser } from "../fixtures/releases.ts"

export const handler: Handlers = {
  GET(req, ctx) {
    const source = new URL(req.url).searchParams?.get("ua") ? "query" : "header"
    const userAgentString = new URL(req.url).searchParams?.get("ua") || req.headers.get("user-agent")

    const userAgent = new UserAgent(userAgentString)

    const { name, major } = userAgent.browser

    console.log("name", name)
    console.log("major", major)
    console.log("isKnownBrowser(name)", name ? isKnownBrowser(name) : false)

    if (name && major && isKnownBrowser(name)) {
      const releaseInfo = getReleaseInfo(name as BrowserName, parseInt(major))
      return ctx.render({ source, known: true, userAgent, ...userAgent.browser, ...releaseInfo })
    }

    return ctx.render({ source, known: false, userAgent, name, version: major, on: null, before: null, after: null })
  },
}

type HomeProps = PageProps & {
  data: {
    source: string
    known: boolean
    userAgent: string
    name: BrowserName
    version: number
    on: ReleaseDate
    before: ReleaseDate
    after: ReleaseDate
  }
}

const formatDate = (date: Date) => date.toLocaleDateString()

const Home: FunctionalComponent<HomeProps> = ({ data }: PageProps) => {
  const { source, known, userAgent, name, version, on, before, after } = data

  const daysSinceRelease = on && Math.floor((new Date().getTime() - on.getTime()) / (1000 * 60 * 60 * 24))
  const yearsSinceRelease = on && Math.floor(daysSinceRelease / 365)

  return (
    <div class="container lg mx-auto flex flex-col items-center justify-center">
      <h1 class="text-4xl font-bold">user-agent.info</h1>
      <div class="m-8">
        <form method="GET" class="block flex flex-row gap-lg">
          <input
            name="ua"
            value={userAgent}
            style={{ width: "850px" }}
            // dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg text-sm p-2.5"
          />
          <button type="submit" class="ml-2">Submit</button>
        </form>
      </div>
      <div class="mx-md">
        {!known && (
          <p>
            Whoa! That's a new one! Or maybe it's an old one? {name && `Consider opening a PR for ${name}.`}
          </p>
        )}
        {known && (
          <>
            {known && source === "query" && <p>Ok! That looks to be {name}.</p>}
            {known && source === "header" && <p>Ok! Looks like you're using {name}.</p>}
            {name} {version} was released
            {on && ` on or about ${formatDate(on)}`}
            {!on && after && !before && ` sometime`}
            {!on && after && ` after ${formatDate(after)}`}
            {!on && after && before && ` and`}
            {!on && before && ` before ${formatDate(before)}`}
            {
              /* {!on && after && before &&
          ` between ${formatDate(after)} and ${formatDate(before)}`} */
            }
            {!on && !after && !before && `. That's all we know`}
            .
            {on && yearsSinceRelease > 1 && ` That's ${yearsSinceRelease} years ago.`}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
