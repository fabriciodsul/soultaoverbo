import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/extension.ts"],
  format: ["cjs"],       // VS Code extensions require CommonJS
  target: "node20",
  outDir: "dist",
  clean: true,
  dts: false,
  sourcemap: true,
  external: ["vscode"], // VS Code API injected by the host
  noExternal: ["@verbo/core"], // Bundle core inline — extension is self-contained
})
