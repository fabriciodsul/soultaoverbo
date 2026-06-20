import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { readFileSync, rmSync, writeFileSync } from "node:fs"
import { SpacedRepetition, MAX_NEW_TERMS_PER_SESSION } from "../src/spaced-rep/index.ts"

function tempPath(): string {
  return join(tmpdir(), `verbo-test-${Math.random().toString(36).slice(2)}.json`)
}

describe("SpacedRepetition", () => {
  let historyPath: string
  let sr: SpacedRepetition

  beforeEach(() => {
    historyPath = tempPath()
    sr = new SpacedRepetition(historyPath)
  })

  afterEach(() => {
    try { rmSync(historyPath) } catch { /* file may not have been created */ }
  })

  // ─── shouldShow ────────────────────────────────────────────────────────────

  it("shows a new term (never seen before)", () => {
    expect(sr.shouldShow("fetch")).toBe(true)
  })

  it("respects MAX_NEW_TERMS_PER_SESSION", () => {
    expect(MAX_NEW_TERMS_PER_SESSION).toBe(3)

    sr.markSeen("a")
    sr.markSeen("b")
    sr.markSeen("c")

    // 4th new term should be blocked
    expect(sr.shouldShow("d")).toBe(false)
  })

  it("re-shows a term already seen today without counting against the limit", () => {
    sr.markSeen("a")
    sr.markSeen("b")
    sr.markSeen("c")

    // "a" was already seen today — still returns true and doesn't hit the cap
    expect(sr.shouldShow("a")).toBe(true)
  })

  it("does not show absorbed terms", () => {
    // Simulate 5 sessions by hacking the internal file
    const sr2 = new SpacedRepetition(historyPath)
    sr2.markSeen("fetch")

    // Rebuild with a patched history
    const history = JSON.parse(readFileSync(historyPath, "utf-8"))
    history.terms["fetch"].sessions = 5
    history.terms["fetch"].absorbed = true
    writeFileSync(historyPath, JSON.stringify(history), "utf-8")

    const sr3 = new SpacedRepetition(historyPath)
    expect(sr3.shouldShow("fetch")).toBe(false)
  })

  // ─── markSeen ──────────────────────────────────────────────────────────────

  it("markSeen increments session count on subsequent days", () => {
    sr.markSeen("fetch")

    // Simulate yesterday's date in the history
    const history = JSON.parse(readFileSync(historyPath, "utf-8"))
    history.terms["fetch"].lastSeen = "2000-01-01"
    history.currentSessionDate = "2000-01-01"
    writeFileSync(historyPath, JSON.stringify(history), "utf-8")

    const sr2 = new SpacedRepetition(historyPath)
    sr2.markSeen("fetch")

    const history2 = JSON.parse(readFileSync(historyPath, "utf-8"))
    expect(history2.terms["fetch"].sessions).toBe(2)
  })

  it("markSeen does not double-count the same term shown twice in one day", () => {
    sr.markSeen("fetch")
    sr.markSeen("fetch") // second call same day

    const history = JSON.parse(readFileSync(historyPath, "utf-8"))
    expect(history.terms["fetch"].sessions).toBe(1)
  })

  it("persists data between instances", () => {
    sr.markSeen("fetch")
    sr.markSeen("map")

    const sr2 = new SpacedRepetition(historyPath)
    const stats = sr2.stats()
    expect(stats.total).toBe(2)
  })

  // ─── absorbedIds ───────────────────────────────────────────────────────────

  it("absorbedIds returns empty set when nothing absorbed", () => {
    sr.markSeen("fetch")
    expect(sr.absorbedIds().size).toBe(0)
  })

  it("absorbedIds returns absorbed term after 5 sessions", () => {
    sr.markSeen("fetch")
    const history = JSON.parse(readFileSync(historyPath, "utf-8"))
    history.terms["fetch"].sessions = 5
    history.terms["fetch"].absorbed = true
    writeFileSync(historyPath, JSON.stringify(history), "utf-8")

    const sr2 = new SpacedRepetition(historyPath)
    expect(sr2.absorbedIds().has("fetch")).toBe(true)
  })

  // ─── reset ─────────────────────────────────────────────────────────────────

  it("reset clears all history", () => {
    sr.markSeen("fetch")
    sr.markSeen("map")
    sr.reset()

    expect(sr.stats().total).toBe(0)
    expect(sr.shouldShow("fetch")).toBe(true)
  })

  it("reset allows new terms after clearing the session cap", () => {
    sr.markSeen("a")
    sr.markSeen("b")
    sr.markSeen("c")
    expect(sr.shouldShow("d")).toBe(false)

    sr.reset()
    expect(sr.shouldShow("d")).toBe(true)
  })

  // ─── stats ─────────────────────────────────────────────────────────────────

  it("stats returns correct counts", () => {
    sr.markSeen("fetch")
    sr.markSeen("map")

    // Force one to absorbed
    const history = JSON.parse(readFileSync(historyPath, "utf-8"))
    history.terms["fetch"].sessions = 5
    history.terms["fetch"].absorbed = true
    writeFileSync(historyPath, JSON.stringify(history), "utf-8")

    const sr2 = new SpacedRepetition(historyPath)
    const stats = sr2.stats()

    expect(stats.total).toBe(2)
    expect(stats.absorbed).toBe(1)
    expect(stats.inProgress).toBe(1)
  })

  it("stats newToday counts only terms first seen today", () => {
    sr.markSeen("fetch")
    sr.markSeen("map")
    expect(sr.stats().newToday).toBe(2)
  })
})
