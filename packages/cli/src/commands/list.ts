import { loadTerms, SpacedRepetition } from "@soltaoverbo/core"
import { bold, cyan, dim, green, yellow } from "../ui.ts"

const CATEGORIES = ["general", "backend", "frontend", "devops", "data", "ai", "javascript", "python", "architecture", "git", "performance", "security", "testing", "typescript"]

export function runList(args: string[]): void {
  const catIdx = args.indexOf("--category")
  const catFilter = catIdx !== -1 ? args[catIdx + 1]?.toLowerCase() : undefined
  const showAbsorbed = args.includes("--absorbed")

  if (catFilter && !CATEGORIES.includes(catFilter)) {
    console.error(`Categoria inválida: "${catFilter}". Válidas: ${CATEGORIES.join(", ")}`)
    process.exit(1)
  }

  const sr = new SpacedRepetition()
  const absorbed = sr.absorbedIds()

  let terms = loadTerms()
  if (catFilter) terms = terms.filter((t) => t.category === catFilter)
  if (!showAbsorbed) terms = terms.filter((t) => !absorbed.has(t.id))

  if (terms.length === 0) {
    const hint = showAbsorbed ? "" : ` ${dim("(use --absorbed para ver absorvidos)")}`
    console.log(dim(`\n  Nenhum termo encontrado.${hint}\n`))
    return
  }

  // group by category (Node 20 compat — no Map.groupBy)
  const grouped = terms.reduce<Record<string, typeof terms>>((acc, t) => {
    ;(acc[t.category] ??= []).push(t)
    return acc
  }, {})

  console.log()
  for (const cat of CATEGORIES) {
    const group = grouped[cat]
    if (!group) continue

    console.log(bold(`  ${cat.toUpperCase()} (${group.length})`))
    console.log(dim("  " + "─".repeat(44)))

    for (const term of group) {
      const tag = absorbed.has(term.id) ? yellow(" ✓") : ""
      console.log(
        `  ${cyan(term.term.padEnd(22))}${tag} ${green(term.translation)}`,
      )
      if (term.explanation) {
        const short = term.explanation.length > 60
          ? term.explanation.slice(0, 57) + "..."
          : term.explanation
        console.log(`  ${"".padEnd(22)}   ${dim(short)}`)
      }
    }
    console.log()
  }

  console.log(dim(`  Total: ${terms.length} termos\n`))
}
