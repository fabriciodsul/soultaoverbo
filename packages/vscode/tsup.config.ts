import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/extension.ts"],
  format: ["cjs"],
  target: "node20",
  outDir: "dist",
  clean: true,
  dts: false,
  sourcemap: true,
  external: ["vscode"],
  noExternal: ["@soltaoverbo/core"],
  esbuildOptions(options) {
    options.charset = "utf8"
  },
})
