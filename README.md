<h2><img src='/static/logo@2x.png' height='30' alt='User-Agent.Info Logo' /> User Agent Info</h2>

### Features

- User-Agent lookup via Web UI and API
- Release date and version-specific usage stats from `caniuse-lite`
- Usage / popularity stats for browsers from `statscounter`

### Future Ideas

- List N most recently queried User-Agents
- Specify your browserslist string to check whether a given User-Agent is covered
- Include additional datasets for usage and popularity (e.g., `useragents.me`)

### API Usage

Specify a `User-Agent` header or `?ua` query parameter to fetch agent details via JSON. See the [Agent](./lib/agent.ts) type for schema
details.

```sh
# `User-Agent` header
curl -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.3' https://user-agent.info/api/v1/agents

# `ua` query parameter
curl 'https://user-agent.info/api/v1/agents?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.3'
```

## Local Development

```sh
git clone https://github.com/nonrational/user-agent.info
cd user-agent.info/
asdf install
deno task start
```

Common tasks are also available via `just`. See `just --list` if you have `just` installed.

## Deployment

[Deno Deploy](https://deno.com/deploy) managed by [`deployctl`](https://github.com/denoland/deployctl) via GitHub Actions. See
[ci.yml](./.github/workflows/ci.yml).

To deploy manually, set `DENO_DEPLOY_TOKEN` in your environment and run `just deploy-preview`.
