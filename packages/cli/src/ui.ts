// ANSI helpers — thin wrappers so we never need chalk
const R = "\x1b[0m"

export const bold  = (s: string) => `\x1b[1m${s}${R}`
export const dim   = (s: string) => `\x1b[2m${s}${R}`
export const green = (s: string) => `\x1b[32m${s}${R}`
export const yellow = (s: string) => `\x1b[33m${s}${R}`
export const cyan  = (s: string) => `\x1b[36m${s}${R}`

export function progressBar(pct: number, width: number): string {
  const filled = Math.round((pct / 100) * width)
  const empty = width - filled
  return `\x1b[32m${"█".repeat(filled)}\x1b[2m${"░".repeat(empty)}${R}`
}
