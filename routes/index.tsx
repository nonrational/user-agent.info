import type { Handlers, PageProps } from "$fresh/server.ts";
import { UserAgent } from "$std/http/user_agent.ts";
import { type BrowserName, getReleaseInfo } from "../fixtures/releases.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const userAgent = new UserAgent(req.headers.get("user-agent") ?? "");

    const { name, major } = userAgent.browser;

    if (name && major) {
      const releaseInfo = getReleaseInfo(name as BrowserName, parseInt(major));

      return ctx.render({ ...userAgent.browser, ...releaseInfo });
    }

    return ctx.render({});
  },
};

const Home = ({ data }: PageProps) => {
  return (
    <div class="mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">user-agent.info</h1>
        <pre class="text-xs" width={30}>
          {data.version}
        </pre>
      </div>
    </div>
  );
};

export default Home;
