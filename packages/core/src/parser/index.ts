import type { Term } from "./loader"

export interface TermMatch {
  id: string
  term: string
  translation: string
  explanation: string
  startIndex: number
  endIndex: number
}

// Prefixes that mark a line as a comment — skip entirely
const COMMENT_LINE_PREFIXES = ["//", "/*", " *", "*", "#"]

// Strips string literals so we don't match terms inside "strings"
const STRING_LITERAL_RE = /(['"`])(?:(?!\1)[^\\]|\\.)*\1/g

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function isCommentLine(line: string): boolean {
  const t = line.trimStart()
  return COMMENT_LINE_PREFIXES.some((p) => t.startsWith(p))
}

function stripStringLiterals(line: string): string {
  return line.replace(STRING_LITERAL_RE, (m) => " ".repeat(m.length))
}

/**
 * Parses a single line of code and returns terms found that haven't been seen yet.
 *
 * @param line       - A single line of source code
 * @param terms      - Term list sorted longest-first (use buildTermIndex)
 * @param seenTerms  - Set of term IDs already shown this session (mutated on match)
 */
export function parseLine(
  line: string,
  terms: Term[],
  seenTerms: Set<string>,
): TermMatch[] {
  if (line.trim() === "") return []
  if (isCommentLine(line)) return []

  const searchable = stripStringLiterals(line)
  const matches: TermMatch[] = []
  // Tracks which character positions are already claimed by a longer match
  const claimed = new Set<number>()

  for (const term of terms) {
    if (seenTerms.has(term.id)) continue

    const pattern = new RegExp(`(?<![\\w])${escapeRegex(term.term)}(?![\\w])`, "gi")
    const match = pattern.exec(searchable)
    if (!match) continue

    const start = match.index
    const end = start + match[0].length

    // Skip if any position overlaps a longer already-matched term
    let overlaps = false
    for (let i = start; i < end; i++) {
      if (claimed.has(i)) { overlaps = true; break }
    }
    if (overlaps) continue

    for (let i = start; i < end; i++) claimed.add(i)

    matches.push({
      id: term.id,
      term: term.term,
      translation: term.translation,
      explanation: term.explanation,
      startIndex: start,
      endIndex: end,
    })
  }

  return matches
}
