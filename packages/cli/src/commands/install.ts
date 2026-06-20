import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { buildTermIndex, loadTerms, SpacedRepetition } from "@verbo/core"
import { bold, dim, green } from "../ui.ts"

const CLAUDE_SETTINGS = join(homedir(), ".claude", "settings.json")
const VERBO_PREFIX = "verbo · "

export function runInstall(): void {
  if (!existsSync(CLAUDE_SETTINGS)) {
    console.error(`Claude Code não encontrado em ${CLAUDE_SETTINGS}`)
    process.exit(1)
  }

  const settings = JSON.parse(readFileSync(CLAUDE_SETTINGS, "utf-8"))

  const sr = new SpacedRepetition()
  const allTerms = buildTermIndex(loadTerms())
  const absorbed = sr.absorbedIds()
  const inProgress = sr.inProgressIds()

  // Prefer terms already in progress (reforço), complete com novos se precisar
  const inProgressTerms = allTerms.filter((t) => inProgress.has(t.id))
  const newTerms = allTerms.filter((t) => !absorbed.has(t.id) && !inProgress.has(t.id))
  const candidates = [...inProgressTerms, ...newTerms].slice(0, 10)

  const verbSpinners = candidates.map((t) => `${VERBO_PREFIX}${t.term} → ${t.translation}`)

  const existing: string[] = (settings.spinnerVerbs?.verbs ?? []).filter(
    (v: string) => !v.startsWith(VERBO_PREFIX),
  )

  settings.spinnerVerbs = {
    mode: settings.spinnerVerbs?.mode ?? "replace",
    verbs: [...existing, ...verbSpinners],
  }

  writeFileSync(CLAUDE_SETTINGS, JSON.stringify(settings, null, 2), "utf-8")

  console.log()
  console.log(bold("  verbo instalado no Claude Code!"))
  console.log(dim("  " + "─".repeat(42)))
  for (const v of verbSpinners) {
    console.log(`  ${green("✓")} ${v}`)
  }
  console.log()
  console.log(dim("  Esses termos aparecem enquanto o Claude pensa."))
  console.log(dim("  Rode 'verbo install' novamente para atualizar."))
  console.log()
}
