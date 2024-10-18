export const debug = (...message: Array<unknown>): void => {
  if (Deno.env.get('DEBUG') === '1') console.debug(...message)
}

// Convert an epoch timestamp to a Date
export const epochToDate = (epoch: number): Date | undefined => {
  const date = new Date(epoch * 1000)
  return isNaN(date.getTime()) ? undefined : date
}

// Count the number of occurrences of a character in a string
export const countLiterals = (str: string, char: string): number => str.split(char).length - 1

// Grab the YYY-MM-DD part of a date
export const toISODate = (date: Date) => date.toISOString().split('T')[0]

export const formatDateYearMonth = (date: Date) => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

export const toOrdinal = (index: number): string => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = index % 100
  return index + (s[(v - 20) % 10] || s[v] || s[0])
}

export const andJoin = (arr: string[]) => {
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return arr.join(' and ')
  return arr.slice(0, -1).join(', ') + ', and ' + arr.slice(-1)[0]
}

export const humanizeDurationSince = (on: Date | undefined | null): string | null => {
  if (!on) return null

  const now = new Date()
  const years = now.getFullYear() - on.getFullYear()
  const months = now.getMonth() - on.getMonth()

  const adjustedMonths = months < 0 ? months + 12 : months
  const adjustedYears = months < 0 ? years - 1 : years

  const parts = []
  if (adjustedYears > 0) parts.push(`${adjustedYears} year${adjustedYears > 1 ? 's' : ''}`)
  if (adjustedMonths > 0) parts.push(`${adjustedMonths} month${adjustedMonths > 1 ? 's' : ''}`)

  return andJoin(parts)
}

export const randInterjection = () => {
  const suffixes = ['Sweet', 'Nice', 'Cool', 'Awesome', 'Rad', 'Neat', 'Groovy', 'Dope', 'Tight', 'Sick', 'Wicked', 'Lit', 'Fire']
  return suffixes[Math.floor(Math.random() * suffixes.length)]
}
