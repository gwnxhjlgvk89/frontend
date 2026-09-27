import { defineConfig } from "vitest/config";
export default defineConfig({
  server: { hmr: false },
  test: { include: ["tests/*.test.ts"], environment: "node" },
});
