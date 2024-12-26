start:
  deno task start

debug:
  DEBUG=1 deno task start

format:
  deno task format-all

update-data:
  deno install npm:caniuse-lite
  deno --allow-net --allow-write=data scripts/fetch-statscounter.ts
  deno --allow-net --allow-write=data scripts/fetch-useragents-me.ts
  deno fmt data

test:
  deno test --allow-env
  deno lint

update-env:
  deno scripts/print-as-of-env.ts > .env

deploy-preview: build
  deployctl deploy

build:
  deno task build

tag-prod:
	git push origin :refs/tags/prod
	git tag -f prod
	git push origin prod
