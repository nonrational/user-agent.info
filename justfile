start:
  deno task start

debug:
  DEBUG=1 deno task start

format:
  deno task format-all

update-usage-data:
  deno --allow-net --allow-write=data scripts/fetch-statscounter.ts
  deno --allow-net --allow-write=data scripts/fetch-useragents-me.ts
  deno fmt lib

test:
  deno test --allow-env
  deno lint

update-env:
  deno scripts/print-as-of-env.ts > .env

deploy-preview: build
  deployctl deploy

build:
  deno task build

tag-prod: check-repo whats-going-to-prod
	git push origin :refs/tags/prod
	git tag -f prod demo
	git push origin prod

whats-going-to-prod:
	@git fetch -f --tags origin
	@echo "$$(git log --pretty=format:"%h}<%aN>}%s" prod..main)\n" | cut -c-120 | column -s '}' -t
	@read -p"Press [Enter] to continue, ^C to abort..." _

check-repo:
	@test $(git rev-parse --abbrev-ref HEAD) = main || (echo "You are not in the main branch" && exit 1)
	@git pull --ff-only origin HEAD
	@test $(shell git rev-parse origin/HEAD) = $(shell git rev-parse HEAD) || (echo "You have commits that have not been pushed" && exit 1)
	@test -z "$(shell git status -s)" || (echo "You have uncommited changes in this branch" && exit 1)
