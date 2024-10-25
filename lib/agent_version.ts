import type { SemVer } from '@std/semver'
import { parse as parseSemVer } from '@std/semver'

// These functions are used to parse and format version strings for various browsers.

// Chromium version numbers consist of 4 parts: MAJOR.MINOR.BUILD.PATCH.
// https://www.chromium.org/developers/version-numbers/

// The version string consists of 1 to 4 numbers separated by dots, for example, 1.2.3.4. Non-zero numbers must not include a leading zero.
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version

// Apple uses the semantic versioning specification to assign and increment version numbers for Safari.

export const MAJOR = 0
export const MINOR = 1
export const BUILD_OR_PATCH = 2
export const PATCH_OR_NONE = 3

// We extend SemVer here to (one day) be able to convert and lean on it for comparison and range checking.
export interface AgentVersion extends SemVer {
  parts: Array<string>
}

// SemVer compatibility requires that we return a 0 for unspecified parts.
export const safeParseInt = (s?: string): number => {
  const num = s ? parseInt(s, 10) : 0

  if (isNaN(num)) {
    console.warn('Ignoring non-integer part: ', s)
    return 0
  }

  return num
}

const parse = (value: string): AgentVersion => {
  const parts = value.split('.')

  if (parts.length < 1 || parts.length > 4) throw new TypeError(`Cannot parse version: ${value}`)

  return {
    major: safeParseInt(parts[MAJOR]),
    minor: safeParseInt(parts[MINOR]),
    patch: parts.length === 3 ? safeParseInt(parts[BUILD_OR_PATCH]) : safeParseInt(parts[PATCH_OR_NONE]),
    build: parts.length === 4 ? [parts[BUILD_OR_PATCH]] : [],
    parts: parts,
    prerelease: [],
  }
}

const toSemVer = (version: AgentVersion): SemVer => {
  return parseSemVer(version.parts.map((v) => v ? v : '0').join('.'))
}

const format = (version: AgentVersion, length?: number): string => {
  if (length && length > 0) return version.parts.slice(0, length).join('.')
  return version.parts.join('.')
}

const tryFormat = (version?: AgentVersion): string | undefined => {
  return version ? format(version) : undefined
}

export default { parse, format, tryFormat, toSemVer }
