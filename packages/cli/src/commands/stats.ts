import { SpacedRepetition } from "@verbo/core"
import { bold, cyan, dim, green, progressBar, yellow } from "../ui.ts"

export function runStats(args: string[] = []): void {
  const sr = new SpacedRepetition()
  const s = sr.stats()

  if (args.includes("--short")) {
    process.stdout.write(`verbo · ${s.newToday} hoje · ${s.total} vistos · ${s.absorbed} abs\n`)
    return
  }

  console.log()
  console.log(bold("  verbo — progresso de aprendizado"))
  console.log(dim("  " + "─".repeat(38)))
  console.log(`  ${cyan("Total visto")}:       ${bold(String(s.total))}`)
  console.log(`  ${green("Absorvidos")}:        ${bold(String(s.absorbed))}`)
  console.log(`  ${yellow("Em progresso")}:      ${bold(String(s.inProgress))}`)
  console.log(`  ${cyan("Novos hoje")}:        ${bold(String(s.newToday))}`)

  if (s.total > 0) {
    const pct = Math.round((s.absorbed / s.total) * 100)
    console.log()
    console.log(`  ${progressBar(pct, 32)} ${pct}% absorvido`)
  }

  console.log()
}
