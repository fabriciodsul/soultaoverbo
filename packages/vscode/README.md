# Solta o Verbo

Aprenda inglês técnico passivamente enquanto você coda — sem sair do fluxo.

O verbo detecta termos técnicos em inglês no seu código e exibe a tradução em pt-BR diretamente na linha, como ghost text. Com repetição espaçada, você absorve o vocabulário gradualmente ao longo dos dias.

---

## Como funciona

Enquanto você edita arquivos, o verbo anota os termos que você ainda não absorveu diretamente no editor:

```javascript
require('dotenv').config()                  // require → importar módulo (CommonJS)
const items = list.filter(x => x.active)   // filter → filtrar / selecionar por condição
async function load() {                     // async → assíncrono / não bloqueia
  const data = await fetch(url)            // await → aguardar / esperar resultado
  return data.find(x => x.id === id)       // find → encontrar o primeiro que satisfaz
}
```

As anotações aparecem em itálico cinza ao final da linha — sem modificar o arquivo, sem interromper o código.

---

## Repetição espaçada

O verbo controla quantas sessões você viu cada termo:

- **Novo** — nunca visto
- **Em progresso** — visto entre 1 e 4 sessões
- **Absorvido** — visto em 5+ sessões, não aparece mais

Você só vê termos novos ou em progresso. Após absorver um termo, ele sai da rotação automaticamente.

---

## Barra de status

A barra inferior mostra seu progresso em tempo real:

```
$(book) verbo: 3 hoje
```

Clique na barra para ver o resumo completo: total de termos vistos, absorvidos e novos hoje.

---

## Comandos

Abra a paleta de comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`) e busque por **Verbo**:

| Comando | Descrição |
|---------|-----------|
| `Verbo: Ver Progresso de Aprendizado` | Exibe estatísticas da sessão atual |
| `Verbo: Ativar / Desativar Anotações` | Liga ou desliga o ghost text globalmente |
| `Verbo: Anotar Arquivo Atual Agora` | Força a anotação imediata do arquivo aberto |
| `Verbo: Resetar Histórico` | Limpa todo o histórico de aprendizado |

---

## Configuração

| Propriedade | Padrão | Descrição |
|-------------|--------|-----------|
| `verbo.enabled` | `true` | Ativa ou desativa as anotações inline |
| `verbo.languages` | 20+ linguagens | Lista de linguagens onde as anotações aparecem |

**Linguagens suportadas por padrão:** TypeScript, JavaScript, Python, Go, Rust, Java, Kotlin, Ruby, PHP, C#, Swift, Dart, Scala, Elixir, Shell, SQL, Lua, C e C++.

Para adicionar ou remover linguagens, edite `verbo.languages` no `settings.json`:

```json
{
  "verbo.languages": ["typescript", "python", "go"]
}
```

---

## Termos disponíveis

275 termos em 14 categorias, detectados automaticamente:

| Categoria | Exemplos |
|-----------|---------|
| `general` | async, await, callback, closure, decorator, factory |
| `backend` | middleware, JWT, GraphQL, retry, interceptor, webhook |
| `frontend` | hydration, hook, PWA, service worker, composable |
| `devops` | pipeline, canary, autoscaling, tracing, sidecar |
| `data` | index, ACID, sharding, DTO, hot path, upsert |
| `ai` | embedding, RAG, LLM, hallucination, fine-tuning |
| `javascript` | filter, find, event loop, prototype, hoisting |
| `python` | list comprehension, context manager, lambda, GIL |
| `architecture` | microservices, CQRS, circuit breaker, SOLID |
| `git` | commit, branch, merge, rebase, cherry-pick, stash |
| `performance` | latency, throughput, bottleneck, CDN, N+1 problem |
| `security` | XSS, SQL injection, CSRF, encryption, RBAC |
| `testing` | mock, stub, spy, TDD, flaky test, snapshot test |
| `typescript` | union type, mapped type, readonly, tuple, infer |

---

## CLI

Prefere o terminal? Use a versão CLI:

```bash
npm install -g @soltaoverbo/cli
verbo start --watch
```

[![npm](https://img.shields.io/npm/v/@soltaoverbo/cli)](https://www.npmjs.com/package/@soltaoverbo/cli)
