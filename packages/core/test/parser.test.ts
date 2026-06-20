import { describe, it, expect, beforeEach } from "vitest"
import { parseLine } from "../src/parser/index.ts"
import type { Term } from "../src/parser/loader.ts"

const TERMS: Term[] = [
  {
    id: "middleware",
    term: "middleware",
    translation: "intermediário",
    explanation: "intercepta a requisição antes do handler",
    category: "backend",
  },
  {
    id: "callback",
    term: "callback",
    translation: "função de retorno",
    explanation: "função passada como argumento",
    category: "general",
  },
  {
    id: "race-condition",
    term: "race condition",
    translation: "condição de corrida",
    explanation: "quando dois processos concorrem pelo mesmo recurso",
    category: "general",
  },
  {
    id: "async-await",
    term: "async",
    translation: "assíncrono",
    explanation: "executa sem bloquear a thread principal",
    category: "general",
  },
]

// Sort longest first (as buildTermIndex does)
const SORTED = [...TERMS].sort((a, b) => b.term.length - a.term.length)

describe("parseLine", () => {
  let seen: Set<string>

  beforeEach(() => {
    seen = new Set()
  })

  it("returns empty array for blank line", () => {
    expect(parseLine("", SORTED, seen)).toEqual([])
    expect(parseLine("   ", SORTED, seen)).toEqual([])
  })

  it("returns empty array for comment lines", () => {
    expect(parseLine("// this is a comment", SORTED, seen)).toEqual([])
    expect(parseLine("/* block comment */", SORTED, seen)).toEqual([])
    expect(parseLine("  # python comment", SORTED, seen)).toEqual([])
    expect(parseLine(" * JSDoc line", SORTED, seen)).toEqual([])
  })

  it("detects a term in a normal code line", () => {
    const matches = parseLine("app.use(middleware)", SORTED, seen)
    expect(matches).toHaveLength(1)
    expect(matches[0]?.id).toBe("middleware")
    expect(matches[0]?.translation).toBe("intermediário")
  })

  it("is case-insensitive", () => {
    const lower = parseLine("app.use(middleware)", SORTED, seen)
    seen.clear()
    const upper = parseLine("app.use(Middleware)", SORTED, seen)
    seen.clear()
    const mixed = parseLine("app.use(MIDDLEWARE)", SORTED, seen)

    expect(lower[0]?.id).toBe("middleware")
    expect(upper[0]?.id).toBe("middleware")
    expect(mixed[0]?.id).toBe("middleware")
  })

  it("skips already-seen terms", () => {
    seen.add("middleware")
    const matches = parseLine("app.use(middleware)", SORTED, seen)
    expect(matches).toHaveLength(0)
  })

  it("does not match terms inside string literals", () => {
    const matches = parseLine('const msg = "middleware is cool"', SORTED, seen)
    expect(matches).toHaveLength(0)
  })

  it("does not match terms inside backtick strings", () => {
    const matches = parseLine("const msg = `use middleware here`", SORTED, seen)
    expect(matches).toHaveLength(0)
  })

  it("prefers longer term over shorter when overlapping (race condition > race)", () => {
    const matches = parseLine("// handle race condition", SORTED, seen)
    // line starts with // so it's a comment — should return empty
    expect(matches).toHaveLength(0)
  })

  it("prefers longer term in code context", () => {
    // "race condition" has a space — it must appear literally in the line
    const matches = parseLine("data = race condition || false", SORTED, seen)
    const ids = matches.map((m) => m.id)
    expect(ids).toContain("race-condition")
  })

  it("detects multiple different terms in the same line", () => {
    const matches = parseLine("async function fetchData(callback) {}", SORTED, seen)
    const ids = matches.map((m) => m.id)
    expect(ids).toContain("async-await")
    expect(ids).toContain("callback")
  })

  it("returns startIndex and endIndex correctly", () => {
    const line = "app.use(middleware)"
    const matches = parseLine(line, SORTED, seen)
    const m = matches[0]!
    expect(line.slice(m.startIndex, m.endIndex).toLowerCase()).toBe("middleware")
  })
})
