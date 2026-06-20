import { describe, it, expect, beforeEach } from "vitest"
import { injectComments } from "../src/injector/index.ts"
import type { Term } from "../src/parser/loader.ts"
import { buildTermIndex } from "../src/parser/loader.ts"

const TERMS: Term[] = [
  {
    id: "middleware",
    term: "middleware",
    translation: "intermediário / camada de processamento",
    explanation: "intercepta a requisição antes de chegar no handler final",
    category: "backend",
  },
  {
    id: "jwt",
    term: "JWT",
    translation: "token de identidade",
    explanation: "prova autoria sem consultar o banco",
    category: "backend",
  },
  {
    id: "callback",
    term: "callback",
    translation: "função de retorno",
    explanation: "função passada como argumento para ser chamada depois",
    category: "general",
  },
]

const SORTED = buildTermIndex(TERMS)

describe("injectComments", () => {
  let seen: Set<string>

  beforeEach(() => {
    seen = new Set()
  })

  it("injects a comment on a line with a matching term", () => {
    const { code } = injectComments("app.use(middleware)", seen, SORTED)
    expect(code).toContain("// middleware →")
    expect(code).toContain("intermediário")
  })

  it("comment format is: term → translation: explanation", () => {
    const { code } = injectComments("app.use(middleware)", seen, SORTED)
    expect(code).toMatch(/\/\/ middleware → intermediário \/ camada de processamento: intercepta/)
  })

  it("does not inject on blank lines", () => {
    const { code } = injectComments("\n\n", seen, SORTED)
    expect(code.trim()).toBe("")
  })

  it("does not inject on comment lines", () => {
    const { code } = injectComments("// app.use(middleware)", seen, SORTED)
    expect(code).toBe("// app.use(middleware)")
  })

  it("does not inject if line already has an inline comment", () => {
    const line = "app.use(middleware) // already explained"
    const { code } = injectComments(line, seen, SORTED)
    expect(code).toBe(line)
  })

  it("preserves original indentation", () => {
    const line = "  app.use(middleware)"
    const { code } = injectComments(line, seen, SORTED)
    expect(code.startsWith("  app.use(middleware)")).toBe(true)
  })

  it("processes multi-line code correctly", () => {
    // Use jwt.verify so "JWT" has a word boundary (followed by "." not a word char)
    const code = [
      "export async function auth(req) {",
      "  const token = req.headers.authorization",
      "  await jwt.verify(token)",
      "  return next()",
      "}",
    ].join("\n")

    const { code: result, injected } = injectComments(code, seen, SORTED)
    const lines = result.split("\n")

    const jwtLine = lines.find((l) => l.includes("jwt.verify"))
    expect(jwtLine).toContain("// JWT →")
    expect(injected.some((m) => m.id === "jwt")).toBe(true)
  })

  it("does not inject the same term twice in the same call", () => {
    const code = "middleware(req)\nmiddleware(res)"
    const { code: result } = injectComments(code, seen, SORTED)
    const commentCount = (result.match(/\/\/ middleware →/g) ?? []).length
    expect(commentCount).toBe(1)
  })

  it("marks injected terms as seen (mutates seenTerms)", () => {
    injectComments("app.use(middleware)", seen, SORTED)
    expect(seen.has("middleware")).toBe(true)
  })

  it("returns the list of injected matches", () => {
    const { injected } = injectComments(
      "app.use(middleware)\nawait jwt.verify(token)",
      seen,
      SORTED,
    )
    const ids = injected.map((m) => m.id)
    expect(ids).toContain("middleware")
    expect(ids).toContain("jwt")
  })
})
