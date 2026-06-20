import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import generalTerms from "../../../../data/terms/general.json"
import backendTerms from "../../../../data/terms/backend.json"
import frontendTerms from "../../../../data/terms/frontend.json"
import devopsTerms from "../../../../data/terms/devops.json"
import dataTerms from "../../../../data/terms/data.json"

export interface Term {
  id: string
  term: string
  translation: string
  explanation: string
  category: string
  level?: "beginner" | "intermediate" | "advanced"
  tags?: string[]
}

// Bundled at build time by tsup — no runtime path resolution needed
const BUILT_IN: Term[] = [
  ...(generalTerms as unknown as Term[]),
  ...(backendTerms as unknown as Term[]),
  ...(frontendTerms as unknown as Term[]),
  ...(devopsTerms as unknown as Term[]),
  ...(dataTerms as unknown as Term[]),
]

/**
 * Returns all terms. Pass a custom directory to load additional terms from disk.
 */
export function loadTerms(termsDir?: string): Term[] {
  if (!termsDir) return BUILT_IN

  if (!existsSync(termsDir)) throw new Error(`Terms directory not found: ${termsDir}`)

  const extra = readdirSync(termsDir)
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => JSON.parse(readFileSync(join(termsDir, f), "utf-8")) as Term[])

  return [...BUILT_IN, ...extra]
}

// Sorts by term length descending so greedy matching tries longer terms first
export function buildTermIndex(terms: Term[]): Term[] {
  return [...terms].sort((a, b) => b.term.length - a.term.length)
}
