# verbo

Aprenda inglês técnico passivamente enquanto você coda.

O verbo detecta termos técnicos em inglês no seu código e exibe traduções em pt-BR — sem interromper o fluxo de trabalho. Com repetição espaçada, você absorve o vocabulário gradualmente ao longo dos dias.

[![npm](https://img.shields.io/npm/v/@soltaoverbo/cli)](https://www.npmjs.com/package/@soltaoverbo/cli)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/verbo-dev.verbo)](https://marketplace.visualstudio.com/items?itemName=verbo-dev.verbo)

---

## Como funciona

Enquanto você edita arquivos, o verbo identifica termos como `middleware`, `payload`, `embedding` e mostra a tradução e explicação em português direto no terminal ou no VS Code — sem modificar o arquivo.

**No terminal (CLI):**
```
exemplo.ts  middleware → intermediário / camada de processamento
              função que intercepta a requisição antes de chegar no handler final
exemplo.ts  embedding → incorporação vetorial
              representação numérica de texto num espaço vetorial — base da busca semântica
exemplo.ts  payload → carga útil / dados da requisição
              conjunto de dados enviados no corpo de uma requisição HTTP
```

**No VS Code (ghost text inline):**
```javascript
require('dotenv').config()                  // require → importar módulo (CommonJS)
const items = list.filter(x => x.active)   // filter → filtrar / selecionar por condição
async function load() {                     // async → assíncrono / não bloqueia
  const data = await fetch(url)            // await → aguardar / esperar resultado
  return data.find(x => x.id === id)       // find → encontrar o primeiro que satisfaz
}
```

A barra de status mostra seu progresso em tempo real:

```
$(book) verbo: 3 hoje
```

### Comandos VS Code

Abra a paleta de comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`) e busque por **Verbo**:

| Comando | Descrição |
|---------|-----------|
| `Verbo: Ver Progresso de Aprendizado` | Exibe estatísticas da sessão atual |
| `Verbo: Ativar / Desativar Anotações` | Liga ou desliga o ghost text globalmente |
| `Verbo: Anotar Arquivo Atual Agora` | Força a anotação imediata do arquivo aberto |
| `Verbo: Resetar Histórico` | Limpa todo o histórico de aprendizado |

### Configuração VS Code

| Propriedade | Padrão | Descrição |
|-------------|--------|-----------|
| `verbo.enabled` | `true` | Ativa ou desativa as anotações inline |
| `verbo.languages` | 20+ linguagens | Lista de linguagens onde as anotações aparecem |

---

## Instalação

### VS Code

Busque **"verbo"** na aba de extensões do VS Code ou acesse o [Marketplace](https://marketplace.visualstudio.com/items?itemName=verbo-dev.verbo).

### CLI

```bash
npm install -g @soltaoverbo/cli
```

---

## CLI

### Watch mode

Observa um diretório e loga termos novos no terminal sempre que um arquivo é salvo.

```bash
verbo start --watch          # observa o diretório atual
verbo start --watch ./src    # observa uma pasta específica
```

A barra de status mostra seu progresso em tempo real:

```
 verbo  ./src  ·  3 hoje  ·  12 vistos  ·  2 absorvidos
```

### Pipe mode

Lê código do stdin, injeta comentários em pt-BR e escreve no stdout.

```bash
cat handler.ts | verbo start
```

### Outros comandos

```bash
verbo stats                      # progresso de aprendizado
verbo stats --short              # saída compacta (para status bars)
verbo install                    # integra com o Claude Code
verbo list                       # lista todos os termos disponíveis
verbo list --category ai         # filtra por categoria
verbo reset                      # limpa o histórico
```

---

## Integração com Claude Code

O comando `verbo install` injeta os termos que você está aprendendo na barra de pensamento do Claude Code. Enquanto o Claude processa, você vê seus termos rotacionando na tela — aprendizado passivo no momento de espera.

```bash
verbo install
```

```
✓ verbo · embedding → incorporação vetorial
✓ verbo · middleware → intermediário / camada de processamento
✓ verbo · RAG → geração aumentada por recuperação
...
Esses termos aparecem enquanto o Claude pensa.
```

---

## Repetição espaçada

O verbo controla quantas vezes você viu cada termo. Após 5 sessões diferentes, o termo é marcado como **absorvido** e deixa de aparecer. Você só vê termos novos ou em progresso — sem repetição desnecessária.

- **Novo** — nunca visto
- **Em progresso** — visto entre 1 e 4 sessões
- **Absorvido** — visto em 5+ sessões, não aparece mais

---

## Termos disponíveis

275 termos em 14 categorias, detectados automaticamente em 20+ linguagens:

| Categoria | Exemplos |
|-----------|---------|
| `general` | async, await, callback, closure, decorator, factory, higher-order function |
| `backend` | middleware, JWT, GraphQL, retry, interceptor, socket, webhook |
| `frontend` | hydration, hook, PWA, service worker, composable, emit |
| `devops` | pipeline, canary, autoscaling, tracing, sidecar, ingress |
| `data` | index, ACID, sharding, DTO, hot path, upsert |
| `ai` | embedding, RAG, LLM, hallucination, fine-tuning, streaming |
| `javascript` | const, let, for, if, filter, find, event loop, prototype, hoisting |
| `python` | list comprehension, context manager, lambda, dataclass, type hints, GIL |
| `architecture` | microservices, event-driven, CQRS, circuit breaker, saga, SOLID |
| `git` | commit, branch, merge, rebase, cherry-pick, stash, pull request |
| `performance` | latency, throughput, bottleneck, CDN, N+1 problem, profiling |
| `security` | XSS, SQL injection, CSRF, encryption, hashing, RBAC, zero trust |
| `testing` | mock, stub, spy, TDD, flaky test, snapshot test, fixture |
| `typescript` | union type, mapped type, readonly, tuple, satisfies, infer |

**Linguagens suportadas:** TypeScript, JavaScript, Python, Go, Rust, Java, Kotlin, Ruby, PHP, C#, Swift, Dart, Scala, Elixir, Shell, SQL, Lua, C, C++ e mais.

---

## Pacotes

| Pacote | Link | Descrição |
|--------|------|-----------|
| `@soltaoverbo/core` | [npm](https://www.npmjs.com/package/@soltaoverbo/core) | Parser, injetor de comentários e sistema de repetição espaçada |
| `@soltaoverbo/cli` | [npm](https://www.npmjs.com/package/@soltaoverbo/cli) | Interface de linha de comando |
| `verbo` (VS Code) | [Marketplace](https://marketplace.visualstudio.com/items?itemName=verbo-dev.verbo) | Extensão com ghost text inline |

---

## Licença

MIT
