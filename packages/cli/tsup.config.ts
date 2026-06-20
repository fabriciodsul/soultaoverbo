import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/bin.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  dts: false,
  // shebang injected by tsup banner so chmod +x works after install
  banner: { js: "#!/usr/bin/env node" },
  external: ["chokidar", "@verbo/core"],
})
