import { createServer } from "node:http"
import { readFileSync } from "node:fs"

async function bootstrap() {
  const cache = new Map<string, unknown>()
  const queue: Array<() => Promise<void>> = []

  async function middleware(req: Request, res: Response) {
    const payload = await req.json()
    const token = req.headers.get("authorization")

    if (!token) {
      return new Response("Unauthorized", { status: 401 })
    }

    const cached = cache.get(token)
    if (cached) return cached

    const handler = routes.get(req.url ?? "/")
    if (!handler) {
      return new Response("Not Found", { status: 404 })
    }

    return handler(payload)
  }

  async function fetchUserData(endpoint: string) {
    const response = await fetch(endpoint)
    const data = await response.json()
    return data
  }

  function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {
    let timer: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), ms)
    }
  }

  const routes = new Map<string, (body: unknown) => Response>()

  async function seed() {
    const migration = readFileSync("./schema.sql", "utf-8")
    console.log("Running migration:", migration.slice(0, 50))
  }

  async function gracefulShutdown(signal: string) {
    console.log(`Received ${signal}, shutting down...`)
    await Promise.all(queue.map((task) => task()))
  }

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
  process.on("SIGINT", () => gracefulShutdown("SIGINT"))

  const server = createServer()
  server.listen(3000)
}

bootstrap()
