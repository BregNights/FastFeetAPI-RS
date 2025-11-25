import tsConfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    root: "./src",
    cache: false,
  },
  plugins: [
    tsConfigPaths(),
    //   swc.vite({
    //     module: { type: "es6" },
    //   }),
  ],
})
