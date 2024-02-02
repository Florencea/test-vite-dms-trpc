import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { join } from "node:path";
import { cwd } from "node:process";
import type { RollupOptions } from "rollup";
import { rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { nodeExternals } from "rollup-plugin-node-externals";
import type { PluginOption, ResolvedConfig } from "vite";
import { defineConfig, loadEnv } from "vite";

const viteExpressBuilder = (options?: RollupOptions): PluginOption => {
  let viteConfig: ResolvedConfig;
  return {
    name: "Vite Express Builder",
    configResolved: (resolvedConfig) => {
      viteConfig = resolvedConfig;
    },
    writeBundle: async () => {
      const config = await rollup({
        input: "./src/server/app.ts",
        plugins: [
          nodeExternals(),
          esbuild({
            minify: !!viteConfig.build.minify,
            target: !viteConfig.build.target
              ? ["es2020", "edge88", "firefox78", "chrome87", "safari14"]
              : viteConfig.build.target,
            sourceMap: !!viteConfig.build.sourcemap,
          }),
        ],
        ...options,
      });
      await config.write({
        dir: join(".", VITE_OUTDIR, "server"),
        format: "module",
      });
    },
  };
};

const { VITE_WEB_BASE, VITE_OUTDIR } = loadEnv("development", cwd(), "");

export default defineConfig({
  base: VITE_WEB_BASE,
  build: {
    outDir: join(".", VITE_OUTDIR, "client"),
    chunkSizeWarningLimit: Infinity,
    reportCompressedSize: false,
    rollupOptions: {
      /**
       * disable rollup 4 build INVALID_ANNOTATION warning
       * https://rollupjs.org/configuration-options/#pure
       * https://rollupjs.org/configuration-options/#onwarn
       */
      onwarn: (warning, defaultHandler) => {
        if (
          warning.code === "INVALID_ANNOTATION" &&
          warning.message.includes("/*#__PURE__*/")
        ) {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
  plugins: [react(), TanStackRouterVite(), viteExpressBuilder()],
});
