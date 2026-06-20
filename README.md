# verbo

Aprenda inglês técnico passivamente enquanto você coda.

O verbo detecta termos técnicos em inglês no seu código e exibe traduções em pt-BR — sem interromper o fluxo de trabalho. Com repetição espaçada, você absorve o vocabulário gradualmente ao longo dos dias.

[![npm](https://img.shields.io/npm/v/@soltaoverbo/cli)](https://www.npmjs.com/package/@soltaoverbo/cli)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/verbo-dev.verbo)](https://marketplace.visualstudio.com/items?itemName=verbo-dev.verbo)

---

## Como funciona

Enquanto você edita arquivos, o verbo identifica termos como `middleware`, `payload`, `debounce` e mostra a tradução e explicação em português direto no terminal ou no VS Code.

```
exemplo.ts  middleware → intermediário / camada de processamento
              função que intercepta a requisição antes de chegar no handler final
exemplo.ts  payload → carga útil / dados da requisição
              conjunto de dados enviados no corpo de uma requisição HTTP
exemplo.ts  debounce → atraso intencional
              adia a execução de uma função até o usuário parar de chamar por X ms
```

---

## Pacotes

| Pacote | Link | Descrição |
|--------|------|-----------|
| `@soltaoverbo/core` | [npm](https://www.npmjs.com/package/@soltaoverbo/core) | Parser, injetor de comentários e sistema de repetição espaçada |
| `@soltaoverbo/cli` | [npm](https://www.npmjs.com/package/@soltaoverbo/cli) | Interface de linha de comando |
| `verbo` (VS Code) | [Marketplace](https://marketplace.visualstudio.com/items?itemName=verbo-dev.verbo) *(em breve)* | Extensão para VS Code com ghost text inline |

---

## Instalação

### CLI

```bash
npm install -g @soltaoverbo/cli
```

### Extensão VS Code

Instale diretamente no VS Code:

```
Ctrl+P → ext install verbo-dev.verbo
```

Ou baixe o `.vsix` na [página de releases](https://github.com/fabriciodsul/soltaoverbo/releases) e instale via `Extensions → ··· → Install from VSIX`.

### Clonar e buildar

```bash
# Pré-requisitos: Node.js 20+ e pnpm 9+
git clone https://github.com/fabriciodsul/soltaoverbo
cd soultaoverbo
pnpm install && pnpm build
```

---

## CLI

### Watch mode

Observa um diretório e loga termos novos no terminal sempre que um arquivo é salvo.

```bash
verbo start --watch          # observa o diretório atual
verbo start --watch ./src    # observa uma pasta específica
```

A barra de status no terminal mostra seu progresso em tempo real:

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
verbo list --category backend    # filtra por categoria
verbo reset                      # limpa o histórico
```

---

## Integração com Claude Code

O comando `verbo install` injeta os termos que você está aprendendo na barra de pensamento do Claude Code. Enquanto o Claude processa, você vê seus termos rotacionando na tela — aprendizado passivo no momento de espera.

```bash
verbo install
```

```
✓ verbo · middleware → intermediário / camada de processamento
✓ verbo · debounce → atraso intencional
✓ verbo · payload → carga útil / dados da requisição
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

106 termos distribuídos em 5 categorias:

| Categoria | Exemplos |
|-----------|---------|
| `general` | callback, closure, debounce, generic, destructuring |
| `backend` | middleware, JWT, OAuth, migration, graceful shutdown |
| `frontend` | hydration, hook, tree shaking, bundle, lazy loading |
| `devops` | pipeline, canary, blue-green, observability, TTL |
| `data` | index, ACID, sharding, upsert, materialized view |

---

## Extensão VS Code

A extensão exibe ghost text inline ao lado das linhas com termos técnicos, sem modificar o arquivo.

**Comandos disponíveis no VS Code:**
- `verbo: Ver progresso` — estatísticas de aprendizado
- `verbo: Ativar/desativar` — liga ou desliga a extensão
- `verbo: Resetar histórico` — limpa tudo e recomeça

---

## Licença

MIT
