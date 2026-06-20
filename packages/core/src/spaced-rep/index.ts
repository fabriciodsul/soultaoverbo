import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { dirname, join } from "node:path"

const DEFAULT_HISTORY_PATH = join(homedir(), ".verbo", "history.json")
const ABSORBED_THRESHOLD = 5
export const MAX_NEW_TERMS_PER_SESSION = 3

interface TermRecord {
  id: string
  sessions: number
  lastSeen: string  // ISO date
  absorbed: boolean
}

interface History {
  version: 1
  currentSessionDate: string  // ISO date — a new calendar day = new session
  terms: Record<string, TermRecord>
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function emptyHistory(): History {
  return { version: 1, currentSessionDate: todayISO(), terms: {} }
}

export interface SpacedRepStats {
  total: number
  absorbed: number
  inProgress: number
  newToday: number
}

export class SpacedRepetition {
  private history: History
  private historyPath: string
  private newTermsThisSession = 0

  constructor(historyPath = DEFAULT_HISTORY_PATH) {
    this.historyPath = historyPath
    this.history = this.load()
    this.maybeStartNewSession()
  }

  // Returns true if this term should be shown (not absorbed, not over session limit)
  shouldShow(termId: string): boolean {
    const record = this.history.terms[termId]
    if (!record) return this.newTermsThisSession < MAX_NEW_TERMS_PER_SESSION
    if (record.absorbed) return false
    // Already seen today — don't count against the new-term budget
    if (record.lastSeen === this.history.currentSessionDate) return true
    return this.newTermsThisSession < MAX_NEW_TERMS_PER_SESSION
  }

  // Call after a term is shown to the user
  markSeen(termId: string): void {
    const today = todayISO()
    const existing = this.history.terms[termId]

    if (!existing) {
      this.newTermsThisSession++
      this.history.terms[termId] = {
        id: termId,
        sessions: 1,
        lastSeen: today,
        absorbed: false,
      }
    } else if (existing.lastSeen !== today) {
      // New session for this term
      existing.sessions++
      existing.lastSeen = today
      existing.absorbed = existing.sessions >= ABSORBED_THRESHOLD
      if (!existing.absorbed) this.newTermsThisSession++
    }

    this.save()
  }

  // Set of term IDs that should not be shown (absorbed)
  absorbedIds(): Set<string> {
    return new Set(
      Object.values(this.history.terms)
        .filter((r) => r.absorbed)
        .map((r) => r.id),
    )
  }

  // Set of term IDs seen at least once but not yet absorbed
  inProgressIds(): Set<string> {
    return new Set(
      Object.values(this.history.terms)
        .filter((r) => !r.absorbed)
        .map((r) => r.id),
    )
  }

  reset(): void {
    this.history = emptyHistory()
    this.newTermsThisSession = 0
    this.save()
  }

  stats(): SpacedRepStats {
    const all = Object.values(this.history.terms)
    const today = todayISO()
    return {
      total: all.length,
      absorbed: all.filter((r) => r.absorbed).length,
      inProgress: all.filter((r) => !r.absorbed).length,
      newToday: all.filter((r) => r.lastSeen === today && r.sessions === 1).length,
    }
  }

  private maybeStartNewSession(): void {
    const today = todayISO()
    if (this.history.currentSessionDate !== today) {
      this.history.currentSessionDate = today
      this.newTermsThisSession = 0
      this.save()
    }
  }

  private load(): History {
    if (!existsSync(this.historyPath)) return emptyHistory()
    try {
      const raw = readFileSync(this.historyPath, "utf-8")
      return JSON.parse(raw) as History
    } catch {
      return emptyHistory()
    }
  }

  private save(): void {
    const dir = dirname(this.historyPath)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(this.historyPath, JSON.stringify(this.history, null, 2), "utf-8")
  }
}
