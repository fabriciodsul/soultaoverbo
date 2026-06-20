import { createInterface } from "node:readline"
import { readFileSync } from "node:fs"
import { extname } from "node:path"
import {
  buildTermIndex,
  injectComments,
  loadTerms,
  SpacedRepetition,
  type TermMatch,
} from "@verbo/core"
import { bold, cyan, dim, green } from "../ui.ts"

const CODE_EXTS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".go", ".rs", ".java", ".kt", ".rb", ".php", ".cs", ".swift",
])

export async function runStart(args: string[]): Promise<void> {
  const watchIdx = args.indexOf("--watch")
  const watchDir = watchIdx !== -1 ? (args[watchIdx + 1] ?? ".") : undefined
  const extIdx = args.indexOf("--ext")
  const extArg = extIdx !== -1 ? args[extIdx + 1] : undefined
  const extensions = extArg
    ? new Set(extArg.split(",").map((e) => (e.startsWith(".") ? e : `.${e}`)))
    : CODE_EXTS

  const sr = new SpacedRepetition()
  const terms = buildTermIndex(loadTerms())

  if (watchDir) {
    await watchMode(watchDir, extensions, sr, terms)
  } else {
    await pipeMode(sr, terms)
  }
}

// ─── Pipe mode ──────────────────────────────────────────────────────────────
// Usage: cat file.ts | verbo start
// Reads stdin, injects pt-BR comments, writes to stdout.

async function pipeMode(
  sr: SpacedRepetition,
  terms: ReturnType<typeof buildTermIndex>,
): Promise<void> {
  const rl = createInterface({ input: process.stdin, terminal: false })
  const lines: string[] = []
  for await (const line of rl) lines.push(line)

  const seenTerms = sr.absorbedIds()
  const { code, injected } = injectComments(lines.join("\n"), seenTerms, terms)

  process.stdout.write(code + "\n")

  for (const match of injected) sr.markSeen(match.id)

  if (injected.length > 0) {
    process.stderr.write(dim(`\n[verbo] ${injected.length} termo(s) anotado(s)\n`))
  }
}

// ─── Watch mode ──────────────────────────────────────────────────────────────
// Usage: verbo start --watch ./src
// Watches a directory; logs newly detected terms to stderr without touching files.

async function watchMode(
  dir: string,
  extensions: Set<string>,
  sr: SpacedRepetition,
  terms: ReturnType<typeof buildTermIndex>,
): Promise<void> {
  const { default: chokidar } = await import("chokidar")

  console.error(bold(`[verbo] Observando ${dir}`) + dim(" — Ctrl+C para parar"))
  process.stderr.write(renderStatusLine(dir, sr))

  const watcher = chokidar.watch(dir, {
    ignoreInitial: true,
    ignored: /([\\/])(\.git|node_modules|dist|\.turbo)([\\/])/,
    persistent: true,
    awaitWriteFinish: { stabilityThreshold: 150, pollInterval: 50 },
  })

  const handle = (filePath: string) => {
    if (!extensions.has(extname(filePath))) return
    let source: string
    try { source = readFileSync(filePath, "utf-8") } catch { return }

    const seenTerms = sr.absorbedIds()
    const { injected } = injectComments(source, seenTerms, terms)

    if (injected.length > 0) {
      process.stderr.write("\r\x1b[2K")
      for (const match of injected) {
        sr.markSeen(match.id)
        logTerm(filePath, match)
      }
    }

    process.stderr.write(renderStatusLine(dir, sr))
  }

  watcher.on("add", handle).on("change", handle)

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      process.stderr.write(dim("\n[verbo] Encerrando...\n"))
      void watcher.close().then(resolve)
    })
  })
}

function renderStatusLine(dir: string, sr: SpacedRepetition): string {
  const s = sr.stats()
  return (
    `\r\x1b[2K` +
    ` ${bold("verbo")}  ${dim(dir)}  ${dim("·")}` +
    `  ${cyan(String(s.newToday))} hoje` +
    `  ${dim("·")}  ${s.total} vistos` +
    `  ${dim("·")}  ${green(String(s.absorbed))} absorvidos`
  )
}

function logTerm(filePath: string, match: TermMatch): void {
  // Show only last 2 path segments to keep lines short
  const short = filePath.replace(/\\/g, "/").split("/").slice(-2).join("/")
  process.stderr.write(
    `${dim(short)}  ${cyan(match.term)} ${dim("→")} ${green(match.translation)}\n` +
    `${"".padEnd(short.length + 2)}  ${dim(match.explanation)}\n`,
  )
}
