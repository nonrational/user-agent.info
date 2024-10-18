#!/usr/bin/env deno

import { getCanIUseLastUpdatedAt } from '../lib/caniuse-lite.ts'

console.info(`CANIUSE_AS_OF_EPOCH=${getCanIUseLastUpdatedAt()}`)
console.info(`DEPLOYED_AT=${new Date().getTime()}`)
