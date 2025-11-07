#!/usr/bin/env deno

import { DOMParser } from '@b-fuze/deno-dom'
import {} from '$std/fs/mod.ts'

const url = 'https://useragents.me'
const response = await fetch(url)
const html = await response.text()

const doc = new DOMParser().parseFromString(html, 'text/html')

if (doc) {
  const desktopJson = doc.querySelector('#most-common-desktop-useragents-json-csv > div:nth-child(1) > textarea')?.textContent
  const mobileJson = doc.querySelector('#most-common-mobile-useragents-json-csv > div:nth-child(1) > textarea')?.textContent

  if (desktopJson) Deno.writeTextFileSync('./data/useragents-me_desktop.json', desktopJson)
  if (mobileJson) Deno.writeTextFileSync('./data/useragents-me_mobile.json', mobileJson)
} else {
  console.error('Failed to parse HTML')
}
