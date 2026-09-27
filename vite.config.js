import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (mode === "production" && !/^https:\/\//.test(env.VITE_API_ORIGIN || ""))
    throw new Error("正式构建必须显式配置 HTTPS VITE_API_ORIGIN");
  return {
    plugins: [uni()],
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ["legacy-js-api", "import", "global-builtin"],
        },
      },
    },
    resolve: { alias: { "@": "/src" } },
    build: { emptyOutDir: true },
  };
});
