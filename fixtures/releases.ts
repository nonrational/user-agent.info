export type BrowserName =
  | "Chrome"
  | "Firefox"
  | "Edge"
  | "Safari"
  | "Opera"
  | "Samsung Internet"
  | "UC Browser"
  | "Yandex"
  | "QQ Browser"
  | "IE"

export type ReleaseDate = Date | null | undefined

type BrowserDefinition = {
  info: {
    name: BrowserName
    manufacturer: string
    wikipediaUrl: string
    friendlyName?: string
    logoUrl?: string
  }
  releases: Record<MajorVersionNumber, string | null>
}

type BrowsersByName = Record<BrowserName, BrowserRelease>
type MajorVersionNumber = number
type BrowserRelease = Record<MajorVersionNumber, ReleaseDate>

const GoogleChrome: BrowserDefinition = {
  info: {
    name: "Chrome",
    manufacturer: "Google",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Google_Chrome_version_history",
  },
  releases: {
    133: null,
    132: null,
    131: null,
    130: "2024-10-15",
    129: "2024-09-17",
    128: null,
    127: null,
    126: null,
    125: null,
    124: null,
    123: null,
    122: null,
    121: null,
    120: "2023-12-06",
    119: "2023-10-31",
    118: "2023-10-10",
    117: "2023-09-12",
    116: "2023-08-15",
    115: "2023-07-18",
    114: "2023-05-30",
    113: "2023-05-02",
    112: "2023-04-04",
    111: "2023-03-07",
    110: "2023-02-07",
    109: "2023-01-10",
    108: "2022-11-29",
    107: "2022-10-25",
    106: "2022-09-27",
    105: "2022-08-30",
    104: "2022-08-02",
    103: "2022-06-21",
    102: "2022-05-24",
    101: "2022-04-26",
    100: "2022-03-29",
    99: "2022-03-01",
    98: "2022-02-01",
    97: "2022-01-04",
    96: "2021-11-16",
    95: "2021-10-19",
    94: "2021-09-21",
    93: "2021-08-31",
    92: "2021-07-20",
    91: "2021-05-25",
    90: "2021-04-13",
    89: "2021-03-02",
    88: "2021-01-19",
    87: "2020-11-17",
    86: "2020-10-06",
    85: "2020-08-25",
    84: "2020-07-14",
    83: "2020-05-19",
    82: null,
    81: "2020-04-07",
    80: "2020-02-04",
    79: "2019-12-10",
    78: "2019-10-22",
    77: "2019-09-10",
    76: "2019-07-30",
    75: "2019-06-04",
    74: "2019-04-23",
    73: "2019-03-12",
    72: "2019-01-29",
    71: "2018-12-04",
    70: "2018-10-16",
    69: "2018-09-04",
    68: "2018-07-24",
  },
}

const MozillaFirefox: BrowserDefinition = {
  info: {
    name: "Firefox",
    manufacturer: "Mozilla",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Firefox_version_history",
  },
  releases: {
    121: "2023-12-19",
    120: "2023-11-21",
    119: "2023-10-24",
    118: "2023-09-26",
    117: "2023-08-29",
    116: "2023-07-25",
    115: "2023-06-27",
    114: "2023-05-30",
    113: "2023-05-09",
    112: "2023-04-11",
    111: "2023-03-14",
    110: "2023-02-14",
    109: "2023-01-17",
    108: "2022-12-13",
    107: "2022-11-15",
    106: "2022-10-18",
    105: "2022-09-20",
    104: "2022-08-23",
    103: "2022-07-26",
    102: "2022-06-28",
    101: "2022-05-31",
    100: "2022-05-03",
    99: "2022-03-29",
    98: "2022-02-08",
    97: "2022-01-11",
    96: "2021-12-07",
    95: "2021-11-02",
    94: "2021-09-07",
    93: "2021-08-10",
    92: "2021-07-13",
    91: "2021-06-22",
    90: "2021-05-25",
    89: "2021-04-20",
    88: "2021-03-23",
    87: "2021-02-23",
    86: "2021-01-26",
    85: "2020-12-15",
    84: "2020-11-17",
    83: "2020-10-20",
    82: "2020-09-22",
    81: "2020-08-25",
    80: "2020-07-28",
    79: "2020-06-30",
    78: "2020-06-02",
    77: "2020-05-05",
    76: "2020-04-07",
    75: "2020-03-10",
    74: "2020-02-11",
    73: "2020-01-07",
    72: "2019-12-03",
    71: "2019-11-05",
    70: "2019-10-08",
    69: "2019-09-03",
    68: "2019-07-09",
  },
}

const MicrosoftEdge: BrowserDefinition = {
  info: {
    name: "Edge",
    manufacturer: "Microsoft",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Microsoft_Edge_version_history",
  },
  releases: {
    132: null,
    131: null,
    130: null,
    129: null,
    128: null,
    127: null,
    126: null,
    125: null,
    124: null,
    123: null,
    122: null,
    120: "2023-12-07",
    119: "2023-11-02",
    118: "2023-10-12",
    117: "2023-09-14",
    116: "2023-08-18",
    115: "2023-07-19",
    114: "2023-06-02",
    113: "2023-05-05",
    112: "2023-04-07",
    111: "2023-03-09",
    110: "2023-02-10",
    109: "2023-01-12",
    108: "2022-12-09",
    107: "2022-11-11",
    106: "2022-10-13",
    105: "2022-09-15",
    104: "2022-08-12",
    103: "2022-07-15",
    102: "2022-06-10",
    101: "2022-05-13",
    100: "2022-04-14",
    99: "2022-03-11",
    98: "2022-02-11",
    97: "2022-01-14",
    96: "2021-12-10",
    95: "2021-11-12",
    94: "2021-10-08",
    93: "2021-09-10",
    92: "2021-08-12",
    91: "2021-07-16",
    90: "2021-06-11",
    89: "2021-05-14",
    88: "2021-04-16",
    87: "2021-03-12",
    86: "2021-02-12",
    85: "2021-01-15",
    84: "2020-12-11",
    83: "2020-11-13",
    82: null, // skipped due to pandemic
    81: "2020-04-13",
    80: "2020-01-15",
    79: "2019-12-10",
    78: "2019-10-22",
    77: "2019-09-10",
    76: "2019-07-30",
    75: "2019-06-04",
    74: "2019-04-23",
    73: "2019-03-12",
    72: "2019-01-29",
    71: "2018-12-04",
    70: "2018-10-16",
    69: "2018-09-04",
    68: "2018-07-24",
  },
}

const AppleSafari: BrowserDefinition = {
  info: {
    name: "Safari",
    manufacturer: "Apple",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Safari_version_history",
  },
  releases: {
    17: "2023-09-18",
    16: "2022-09-12",
    15: "2021-09-20",
    14: "2020-09-16",
    13: "2019-09-19",
    12: "2018-09-17",
    11: "2017-09-19",
    10: "2016-09-20",
    9: "2015-09-30",
    8: "2014-10-16",
    7: "2013-10-22",
    6: "2012-07-25",
    5: "2010-06-07",
    4: "2009-06-08",
    3: "2007-06-11",
    2: "2005-04-29",
    1: "2003-06-23",
  },
}

const Opera: BrowserDefinition = {
  info: {
    name: "Opera",
    manufacturer: "Opera Software",
    wikipediaUrl: "https://en.wikipedia.org/wiki/History_of_the_Opera_web_browser",
  },
  releases: {
    113: "2024-08-24",
    112: "2024-07-11",
    111: null,
    110: null,
    109: null,
    108: null,
    107: null,
    106: "2023-12-13",
    105: "2023-11-15",
    104: "2023-10-18",
    103: "2023-09-20",
    102: "2023-08-23",
    101: "2023-07-26",
    100: "2023-06-28",
    99: "2023-05-31",
    98: "2023-05-03",
    97: "2023-04-05",
    96: "2023-03-08",
    95: "2023-02-08",
    94: "2023-01-11",
    93: "2022-11-30",
    92: "2022-10-26",
    91: "2022-09-28",
    90: "2022-08-31",
    89: "2022-08-03",
    88: "2022-06-22",
    87: "2022-05-25",
  },
}
const SamsungInternet: BrowserDefinition = {
  info: {
    name: "Samsung Internet",
    manufacturer: "Samsung",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Samsung_Internet",
  },
  releases: {
    23: "2023-11-13",
    22: "2023-09-11",
    21: "2023-06-19",
    20: "2023-03-13",
    19: "2022-10-18",
    18: "2022-07-06",
    17: "2022-03-22",
    16: "2021-12-15",
    15: "2021-08-02",
    14: "2021-03-15",
    13: "2020-10-26",
    12: "2020-06-03",
    11: "2020-02-07",
    10: "2019-09-24",
    9: "2019-04-08",
    8: "2018-12-21",
    7: "2018-05-31",
    6: "2017-12-18",
    5: "2017-05-22",
    4: "2016-12-15",
  },
}

const UCBrowser: BrowserDefinition = {
  info: {
    name: "UC Browser",
    manufacturer: "UCWeb",
    wikipediaUrl: "https://en.wikipedia.org/wiki/UC_Browser",
  },
  releases: {
    13: "2019-12-17",
    12: "2017-08-21",
    11: "2016-05-25",
    10: "2014-08-26",
    9: "2013-03-19",
    8: "2011-08-03",
    7: "2009-08-25",
    6: "2008-03-25",
    5: "2007-05-15",
    4: "2006-09-01",
    3: "2005-11-01",
    2: "2005-03-01",
    1: "2004-08-01",
  },
}

const YandexBrowser: BrowserDefinition = {
  info: {
    name: "Yandex",
    manufacturer: "Yandex",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Yandex_Browser",
  },
  releases: {
    23: "2023-06-05",
    22: "2022-11-22",
    21: "2022-03-22",
    20: "2021-03-16",
    19: "2020-03-17",
    18: "2018-11-27",
    17: "2017-10-17",
    16: "2016-11-22",
    15: "2015-12-15",
    14: "2014-12-09",
    13: "2013-12-10",
    1: "2012-10-01",
  },
}

const QQBrowser: BrowserDefinition = {
  info: {
    name: "QQ Browser",
    manufacturer: "Tencent",
    wikipediaUrl: "https://en.wikipedia.org/wiki/QQ_Browser",
  },
  releases: {
    13: "2023-03-21",
    12: "2022-03-22",
    11: "2021-03-23",
    10: "2020-03-24",
    9: "2019-03-26",
    8: "2018-03-27",
    7: "2017-03-28",
    6: "2016-03-29",
    5: "2015-03-31",
    4: "2014-04-01",
    3: "2013-04-02",
    2: "2012-04-03",
    1: "2011-04-05",
  },
}

const InternetExplorer: BrowserDefinition = {
  info: {
    name: "IE",
    friendlyName: "Internet Explorer",
    manufacturer: "Microsoft",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Internet_Explorer_versions",
  },
  releases: {
    11: "2013-10-17",
    10: "2012-10-26",
    9: "2011-03-14",
    8: "2009-03-19",
    7: "2006-10-18",
    6: "2001-10-25",
    5: "1999-03-18",
    4: "1997-09-04",
    3: "1996-08-13",
    2: "1995-11-22",
    1: "1995-07-27",
  },
}

const castToDateValues = (def: BrowserDefinition): BrowserRelease => {
  const newObj: BrowserRelease = {}

  for (const [key, value] of Object.entries(def.releases)) {
    newObj[parseInt(key)] = value ? new Date(value) : null
  }
  return newObj
}

export const Releases: BrowsersByName = {
  "Chrome": castToDateValues(GoogleChrome),
  "Firefox": castToDateValues(MozillaFirefox),
  "Edge": castToDateValues(MicrosoftEdge),
  "Safari": castToDateValues(AppleSafari),
  "Opera": castToDateValues(Opera),
  "Samsung Internet": castToDateValues(SamsungInternet),
  "UC Browser": castToDateValues(UCBrowser),
  "Yandex": castToDateValues(YandexBrowser),
  "QQ Browser": castToDateValues(QQBrowser),
  "IE": castToDateValues(InternetExplorer),
} as const

export const isKnownBrowser = (name: string) => name in Releases

export const isKnownRelease = (name: string, major: MajorVersionNumber) => {
  return isKnownBrowser(name) && major in Releases[name as BrowserName]
}

const getReleasedOn = (name: BrowserName, major: number): ReleaseDate => {
  return isKnownRelease(name, major) ? Releases[name][major] : undefined
}

const getReleasedAfter = (name: BrowserName, major: number): ReleaseDate => {
  let releasedAfter: ReleaseDate = null

  while (!releasedAfter && isKnownRelease(name, major)) {
    releasedAfter = getReleasedOn(name, major--)
  }

  return releasedAfter
}

const getReleasedBefore = (name: BrowserName, major: number): ReleaseDate => {
  let releasedBefore: ReleaseDate = null

  while (!releasedBefore && isKnownRelease(name, major)) {
    releasedBefore = getReleasedOn(name, major++)
  }

  return releasedBefore
}

export type ReleaseInfo = {
  name: BrowserName
  major: MajorVersionNumber
  on: ReleaseDate
  after: ReleaseDate
  before: ReleaseDate
}

export const getReleaseInfo = (
  name: BrowserName,
  major: number,
): ReleaseInfo => {
  return {
    name,
    major,
    on: getReleasedOn(name, major),
    after: getReleasedAfter(name, major),
    before: getReleasedBefore(name, major),
  }
}
