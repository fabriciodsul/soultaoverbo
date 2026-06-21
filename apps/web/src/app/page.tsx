export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#0a0a0a]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-white/90 backdrop-blur-sm border-b border-black/5">
        <span className="text-sm font-semibold tracking-tight">verbo</span>
        <div className="flex items-center gap-6 text-sm text-black/50">
          <a href="#funciona" className="hover:text-black transition-colors">Como funciona</a>
          <a href="#explain" className="hover:text-black transition-colors">verbo explain</a>
          <a href="#instalacao" className="hover:text-black transition-colors">Instalação</a>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=verbo-dev.verbo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-black text-white rounded-full text-xs font-medium hover:bg-black/80 transition-colors"
          >
            VS Code
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-28 px-8 text-center max-w-4xl mx-auto">
        <div className="inline-block mb-6 px-3 py-1 text-xs font-medium border border-black/10 rounded-full text-black/40 tracking-wide uppercase">
          275 termos · 14 categorias · repetição espaçada
        </div>
        <h1 className="text-shimmer text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Inglês técnico enquanto você coda
        </h1>
        <p className="text-lg md:text-xl text-black/50 max-w-xl mx-auto leading-relaxed mb-10">
          O verbo detecta termos como <Code>middleware</Code>, <Code>embedding</Code> e <Code>payload</Code> no
          seu codigo e exibe traducoes em portugues — sem interromper o fluxo.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <code className="bg-black text-[#4ade80] px-5 py-3 rounded-xl text-sm font-mono select-all">
            npm install -g @soltaoverbo/cli
          </code>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=verbo-dev.verbo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 border border-black/15 rounded-xl text-sm font-medium hover:border-black/40 transition-colors"
          >
            Instalar no VS Code
          </a>
        </div>
      </section>

      {/* Demo */}
      <section id="funciona" className="py-20 px-8 bg-[#f9f9f9]">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Como funciona</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Aprenda sem parar de trabalhar
          </h2>
          <p className="text-black/50 mb-12 max-w-lg">
            O verbo funciona em segundo plano. Você codifica, ele ensina.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard
              title="Watch mode"
              description="Observa o diretorio e loga novos termos no terminal sempre que um arquivo e salvo."
              example="verbo start --watch ./src"
            />
            <FeatureCard
              title="VS Code"
              description="Ghost text inline ao final de cada linha com a tradução em português. Zero configuração."
              example="async → assíncrono / nao bloqueia"
            />
            <FeatureCard
              title="Repeticao espacada"
              description="Após ver um termo em 5 sessões diferentes, ele é marcado como absorvido e sai da rotação."
              example="12 vistos · 3 absorvidos"
            />
          </div>
        </div>
      </section>

      {/* verbo explain */}
      <section id="explain" className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Novo</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            verbo explain
          </h2>
          <p className="text-black/50 mb-10 max-w-lg">
            Explica qualquer arquivo linha por linha em português via IA. Útil para entender código
            legado, bibliotecas novas ou trechos complexos sem sair do terminal.
          </p>

          <div className="bg-black rounded-2xl overflow-hidden mb-8">
            <div className="flex items-center gap-1.5 px-5 py-4 border-b border-white/5">
              <span className="w-3 h-3 rounded-full bg-white/10" />
              <span className="w-3 h-3 rounded-full bg-white/10" />
              <span className="w-3 h-3 rounded-full bg-white/10" />
              <span className="ml-3 text-xs text-white/20 font-mono">auth.ts</span>
            </div>
            <pre className="p-6 text-sm font-mono overflow-x-auto leading-7">
              <CodeLine>
                <Kw>import</Kw> {"{ readFileSync }"} <Kw>from</Kw> <Str>"node:fs"</Str>
                <Comment>  // importa leitura sincrona de arquivos</Comment>
              </CodeLine>
              <CodeLine>
                <Kw>import</Kw> {"{ basename, extname }"} <Kw>from</Kw> <Str>"node:path"</Str>
                <Comment>  // extrai nome e extensao do caminho</Comment>
              </CodeLine>
              <CodeLine>&nbsp;</CodeLine>
              <CodeLine>
                <Kw>export async function</Kw> <Fn>runExplain</Fn>
                {"(args: string[]): Promise<void> {"}
                <Comment>  // funcao principal do comando</Comment>
              </CodeLine>
              <CodeLine>
                {"  "}<Kw>const</Kw> filePath = args[<Num>0</Num>]
                <Comment>  // pega o primeiro argumento como caminho</Comment>
              </CodeLine>
              <CodeLine>
                {"  "}<Kw>if</Kw> (!filePath) {"{"} <Kw>return</Kw> {"}"}
                <Comment>  // valida se o arquivo foi informado</Comment>
              </CodeLine>
            </pre>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 border border-black/8 rounded-2xl">
              <p className="text-xs text-black/40 uppercase tracking-wide font-medium mb-2">Configurar</p>
              <code className="text-sm font-mono">verbo config set-key sk-ant-...</code>
            </div>
            <div className="p-5 border border-black/8 rounded-2xl">
              <p className="text-xs text-black/40 uppercase tracking-wide font-medium mb-2">Usar</p>
              <code className="text-sm font-mono">verbo explain src/auth.ts</code>
            </div>
          </div>
        </div>
      </section>

      {/* Termos */}
      <section className="py-20 px-8 bg-[#f9f9f9]">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Cobertura</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
            275 termos em 14 categorias
          </h2>
          <div className="flex flex-wrap gap-2">
            {["general","backend","frontend","devops","data","ai","javascript","python","architecture","git","performance","security","testing","typescript"].map((cat) => (
              <span
                key={cat}
                className="px-3 py-1.5 bg-[#4ade80]/15 text-[#16a34a] text-sm font-medium rounded-full border border-[#4ade80]/30"
              >
                {cat}
              </span>
            ))}
          </div>
          <p className="mt-8 text-sm text-black/40">
            Detectados automaticamente em TypeScript, JavaScript, Python, Go, Rust, Java, Kotlin, Ruby, PHP, C#, Swift, Dart, Scala, Elixir, Shell, SQL, Lua, C e C++.
          </p>
        </div>
      </section>

      {/* Instalacao */}
      <section id="instalacao" className="py-20 px-8">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Instalação</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
            Pronto em 30 segundos
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold mb-3">CLI</p>
              <div className="bg-black rounded-2xl px-5 py-4 font-mono text-sm text-[#4ade80]">
                npm install -g @soltaoverbo/cli
              </div>
              <p className="mt-4 text-sm text-black/40">
                Depois rode <span className="font-mono text-black/70">verbo start --watch</span> no diretório do projeto.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">VS Code</p>
              <a
                href="https://marketplace.visualstudio.com/items?itemName=verbo-dev.verbo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-black text-white rounded-2xl px-5 py-4 text-sm font-medium hover:bg-black/80 transition-colors"
              >
                <span>Solta o Verbo — VS Code Marketplace</span>
                <span className="text-white/30 text-xs">→</span>
              </a>
              <p className="mt-4 text-sm text-black/40">
                Ghost text inline, repeticao espacada, zero configuracao.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agoniadoz — silent mention */}
      <section className="py-16 px-8 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-black/30 uppercase tracking-widest font-medium mb-1">Da Mesma Equipe</p>
            <p className="text-sm text-black/60">
              Fabricio Guimarães, Julio Sergio e Bruno Carvalho também estão construindo o{" "}
              <a
                href="https://www.instagram.com/agoniadoz"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-black hover:underline"
              >
                @Agoniadoz
              </a>
              {" "}— um copiloto para motoristas de aplicativo. Vem aí.
            </p>
          </div>
          <a
            href="https://www.instagram.com/agoniadoz"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 text-xs font-medium border border-black/15 rounded-full hover:border-black/40 transition-colors"
          >
            @Agoniadoz
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-black/5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-black/30">
          <span>verbo by Agoniadoz</span>
          <div className="flex items-center gap-4">
            <a href="https://www.npmjs.com/package/@soltaoverbo/cli" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">npm</a>
            <a href="https://marketplace.visualstudio.com/items?itemName=verbo-dev.verbo" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">VS Code</a>
            <a href="https://github.com/fabriciodsul/soltaoverbo" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

    </main>
  )
}

// ─── Small components ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-black/30 uppercase tracking-widest font-medium mb-3">{children}</p>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-base bg-black/5 px-1.5 py-0.5 rounded text-black/70">{children}</code>
}

function FeatureCard({ title, description, example }: { title: string; description: string; example: string }) {
  return (
    <div className="p-6 bg-[#4ade80]/10 border border-[#4ade80]/25 rounded-2xl">
      <p className="font-semibold text-sm mb-2 text-[#16a34a]">{title}</p>
      <p className="text-sm text-black/60 leading-relaxed mb-4">{description}</p>
      <code className="text-xs font-mono text-black/40">{example}</code>
    </div>
  )
}

function CodeLine({ children }: { children: React.ReactNode }) {
  return <div className="whitespace-pre-wrap">{children}</div>
}

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-[#c792ea]">{children}</span>
}

function Fn({ children }: { children: React.ReactNode }) {
  return <span className="text-[#82aaff]">{children}</span>
}

function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-[#c3e88d]">{children}</span>
}

function Num({ children }: { children: React.ReactNode }) {
  return <span className="text-[#f78c6c]">{children}</span>
}

function Comment({ children }: { children: React.ReactNode }) {
  return <span className="text-[#4ade80]/70 italic">{children}</span>
}
