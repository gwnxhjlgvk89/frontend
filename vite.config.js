import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import Components from "@uni-helper/vite-plugin-uni-components";
import { WotResolver } from "@uni-helper/vite-plugin-uni-components/resolvers";

export default defineConfig(({ mode }) => {
  // mode 会捕获 --mode 参数值
  const isDev = mode === "development";

  console.log(`🚀 MODE: ${mode}`);

  return {
    define: {
      "globalThis.__DEV__": isDev,
    },
    plugins: [
      Components({
        resolvers: [WotResolver()],
      }),
      uni(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ["legacy-js-api", "import", "global-builtin"],
        },
      },
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    build: {
      emptyOutDir: true,
    },
  };
});
