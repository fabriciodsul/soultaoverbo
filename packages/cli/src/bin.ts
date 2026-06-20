import { execSync } from "node:child_process"
import { runInstall } from "./commands/install.ts"
import { runList } from "./commands/list.ts"
import { runReset } from "./commands/reset.ts"
import { runStart } from "./commands/start.ts"
import { runStats } from "./commands/stats.ts"
import { bold, dim } from "./ui.ts"

if (process.platform === "win32") {
  try { execSync("chcp 65001", { stdio: "ignore" }) } catch {}
}

const VERSION = "0.1.0"
const [, , sub, ...rest] = process.argv

function help(): void {
  console.log(`
  ${bold("verbo")} v${VERSION} — aprenda inglês técnico passivamente

  ${bold("USO")}
    verbo <comando> [opções]

  ${bold("COMANDOS")}
    ${bold("start")}                  Modo pipe: lê stdin e injeta comentários em pt-BR
    ${bold("start --watch")} ${dim("<dir>")}   Observa diretório e loga termos novos no terminal
    ${bold("stats")}                  Mostra seu progresso de aprendizado
    ${bold("stats --short")}          Saída compacta para status bars
    ${bold("install")}                Injeta termos no Claude Code (barra de pensamento)
    ${bold("reset")}                  Limpa todo o histórico
    ${bold("list")}                   Lista todos os termos disponíveis
    ${bold("list --category")} ${dim("<cat>")}  Filtra por: general, backend, frontend, devops, data
    ${bold("list --absorbed")}        Inclui termos já absorvidos

  ${bold("EXEMPLOS")}
    cat handler.ts | verbo start
    verbo start --watch ./src
    verbo stats
    verbo install
    verbo list --category backend

  ${bold("OPÇÕES GLOBAIS")}
    ${bold("--version")}, ${bold("-v")}         Versão atual
    ${bold("--help")}, ${bold("-h")}             Esta ajuda
`)
}

switch (sub) {
  case "start":
    await runStart(rest)
    break
  case "stats":
    runStats(rest)
    break
  case "install":
    runInstall()
    break
  case "reset":
    await runReset()
    break
  case "list":
    runList(rest)
    break
  case "--version":
  case "-v":
    console.log(VERSION)
    break
  case "--help":
  case "-h":
  case undefined:
    help()
    break
  default:
    console.error(`Comando desconhecido: "${sub}". Use "verbo --help" para ver os comandos.`)
    process.exit(1)
}
