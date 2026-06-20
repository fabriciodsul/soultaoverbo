import { buildTermIndex, loadTerms, type Term } from "../parser/loader"
import { parseLine, type TermMatch } from "../parser/index"

export interface InjectorOptions {
  mode: "inline"
  style: "pt-br"
  prefix: string
}

export interface InjectionResult {
  code: string
  injected: TermMatch[]
}

const DEFAULT_OPTIONS: InjectorOptions = {
  mode: "inline",
  style: "pt-br",
  prefix: "",
}

// Detects if a line already has an inline comment (outside of string literals)
const INLINE_COMMENT_RE = /(?<!['"`:])\/\//
const HASH_COMMENT_RE = /(?<!['"`:])#/

function hasInlineComment(line: string): boolean {
  return INLINE_COMMENT_RE.test(line) || HASH_COMMENT_RE.test(line)
}

function formatComment(match: TermMatch): string {
  // Trim explanation to keep lines reasonable
  const shortExplanation = match.explanation.length > 80
    ? match.explanation.slice(0, 77) + "..."
    : match.explanation
  return `  // ${match.term} → ${match.translation}: ${shortExplanation}`
}

/**
 * Injects inline Portuguese comments into generated code for unknown terms.
 *
 * @param code      - Full source code string (may be multi-line)
 * @param seenTerms - Set of term IDs seen this session (mutated — marks new terms as seen)
 * @param terms     - Sorted term index (defaults to loading from data/terms/)
 * @param options   - Injection options
 */
export function injectComments(
  code: string,
  seenTerms: Set<string>,
  terms: Term[] = buildTermIndex(loadTerms()),
  options: InjectorOptions = DEFAULT_OPTIONS,
): InjectionResult {
  const lines = code.split("\n")
  const allInjected: TermMatch[] = []

  const resultLines = lines.map((line) => {
    if (line.trim() === "") return line
    if (hasInlineComment(line)) return line

    const matches = parseLine(line, terms, seenTerms)
    if (matches.length === 0) return line

    // Use the first (longest) match for the comment
    const match = matches[0]!
    seenTerms.add(match.id)
    allInjected.push(match)

    return `${line}${options.prefix}${formatComment(match)}`
  })

  return {
    code: resultLines.join("\n"),
    injected: allInjected,
  }
}
