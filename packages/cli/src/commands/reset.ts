import { createInterface } from "node:readline"
import { SpacedRepetition } from "@verbo/core"
import { bold, dim, yellow } from "../ui.ts"

export async function runReset(): Promise<void> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })

  await new Promise<void>((resolve) => {
    rl.question(
      `${yellow("⚠")}  Isso apagará todo o histórico de aprendizado. Confirmar? ${dim("[s/N]")} `,
      (answer) => {
        rl.close()
        if (answer.trim().toLowerCase() === "s") {
          new SpacedRepetition().reset()
          console.log(bold("✓ Histórico resetado."))
        } else {
          console.log(dim("Cancelado."))
        }
        resolve()
      },
    )
  })
}
