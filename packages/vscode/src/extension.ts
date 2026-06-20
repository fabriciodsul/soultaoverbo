import * as vscode from "vscode"
import { buildTermIndex, loadTerms, parseLine, SpacedRepetition } from "@verbo/core"

// ─── State (lives for the VS Code session) ───────────────────────────────────

let decoration: vscode.TextEditorDecorationType
let sr: SpacedRepetition
let terms: ReturnType<typeof buildTermIndex>
let statusBar: vscode.StatusBarItem
const seenThisSession = new Set<string>()
let enabled = true
let debounce: ReturnType<typeof setTimeout> | undefined

// ─── Activation ──────────────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext): void {
  sr = new SpacedRepetition()
  terms = buildTermIndex(loadTerms())
  enabled = vscode.workspace.getConfiguration("verbo").get<boolean>("enabled", true)

  decoration = vscode.window.createTextEditorDecorationType({
    after: {
      color: new vscode.ThemeColor("editorGhostText.foreground"),
      fontStyle: "italic",
      margin: "0 0 0 1.5em",
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
  })

  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBar.command = "verbo.stats"
  statusBar.tooltip = "Verbo — clique para ver progresso"
  refreshStatusBar()
  statusBar.show()
  context.subscriptions.push(statusBar)

  if (vscode.window.activeTextEditor) {
    decorateEditor(vscode.window.activeTextEditor)
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) decorateEditor(editor)
    }),

    vscode.workspace.onDidChangeTextDocument((e) => {
      const editor = vscode.window.activeTextEditor
      if (!editor || e.document !== editor.document) return
      clearTimeout(debounce)
      debounce = setTimeout(() => decorateEditor(editor), 400)
    }),

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("verbo.enabled")) {
        enabled = vscode.workspace.getConfiguration("verbo").get<boolean>("enabled", true)
        if (!enabled) clearAllDecorations()
        else if (vscode.window.activeTextEditor) decorateEditor(vscode.window.activeTextEditor)
      }
    }),

    vscode.commands.registerCommand("verbo.stats", showStats),
    vscode.commands.registerCommand("verbo.reset", resetHistory),
    vscode.commands.registerCommand("verbo.toggle", toggleEnabled),
    vscode.commands.registerCommand("verbo.decorateNow", () => {
      const editor = vscode.window.activeTextEditor
      if (editor) decorateEditor(editor)
      else vscode.window.showWarningMessage("verbo: nenhum arquivo aberto")
    }),
  )
}

// ─── Core decoration logic ────────────────────────────────────────────────────

function decorateEditor(editor: vscode.TextEditor): void {
  if (!enabled) return

  const languages = vscode.workspace.getConfiguration("verbo")
    .get<string[]>("languages") ??
    ["typescript", "typescriptreact", "javascript", "javascriptreact",
     "python", "go", "rust", "java", "kotlin", "ruby", "php", "csharp"]

  if (!languages.includes(editor.document.languageId)) return

  const decorations: vscode.DecorationOptions[] = []
  const seenTerms = new Set([...sr.absorbedIds(), ...seenThisSession])
  const doc = editor.document

  for (let i = 0; i < doc.lineCount; i++) {
    const line = doc.lineAt(i)
    const matches = parseLine(line.text, terms, seenTerms)
    if (matches.length === 0) continue

    const match = matches[0]!
    seenTerms.add(match.id)
    seenThisSession.add(match.id)
    sr.markSeen(match.id)

    decorations.push({
      range: new vscode.Range(line.range.end, line.range.end),
      renderOptions: {
        after: { contentText: `  // ${match.term} → ${match.translation}` },
      },
    })
  }

  editor.setDecorations(decoration, decorations)
  refreshStatusBar()
}

function clearAllDecorations(): void {
  for (const editor of vscode.window.visibleTextEditors) {
    editor.setDecorations(decoration, [])
  }
}

// ─── Status bar ───────────────────────────────────────────────────────────────

function refreshStatusBar(): void {
  const s = sr.stats()
  const icon = enabled ? "$(book)" : "$(book)$(circle-slash)"
  statusBar.text = s.newToday > 0 ? `${icon} verbo: ${s.newToday} hoje` : `${icon} verbo`
}

// ─── Commands ─────────────────────────────────────────────────────────────────

function showStats(): void {
  const s = sr.stats()
  const pct = s.total > 0 ? Math.round((s.absorbed / s.total) * 100) : 0
  vscode.window.showInformationMessage(
    `verbo — ${s.total} termos vistos · ${s.absorbed} absorvidos (${pct}%) · ${s.newToday} novos hoje`,
  )
}

async function resetHistory(): Promise<void> {
  const choice = await vscode.window.showWarningMessage(
    "Resetar todo o histórico de aprendizado do verbo?",
    { modal: true },
    "Sim, resetar",
  )
  if (choice === "Sim, resetar") {
    sr.reset()
    seenThisSession.clear()
    refreshStatusBar()
    vscode.window.showInformationMessage("Histórico resetado.")
  }
}

function toggleEnabled(): void {
  enabled = !enabled
  vscode.workspace.getConfiguration("verbo").update("enabled", enabled, true)
  refreshStatusBar()
  if (!enabled) {
    clearAllDecorations()
    vscode.window.setStatusBarMessage("verbo desativado", 2000)
  } else {
    if (vscode.window.activeTextEditor) decorateEditor(vscode.window.activeTextEditor)
    vscode.window.setStatusBarMessage("verbo ativado", 2000)
  }
}

// ─── Deactivation ─────────────────────────────────────────────────────────────

export function deactivate(): void {
  decoration?.dispose()
  statusBar?.dispose()
}
