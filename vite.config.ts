import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { join } from "node:path";
import { cwd } from "node:process";
import { rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { nodeExternals } from "rollup-plugin-node-externals";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const ServerBuilder = (): PluginOption => {
  return {
    name: "Server Builder",
    writeBundle: async () => {
      const config = await rollup({
        input: "./src/server/app.ts",
        plugins: [nodeExternals(), esbuild({ minify: true })],
      });
      await config.write({
        dir: join(".", VITE_OUTDIR, "server"),
        format: "module",
      });
    },
  };
};

const {
  VITE_WEB_BASE,
  VITE_OUTDIR,
  VITE_TITLE,
  VITE_FAVICON,
  VITE_THEME_COLOR_PRIMARY,
} = loadEnv("development", cwd(), "");

export default defineConfig({
  base: VITE_WEB_BASE,
  build: {
    outDir: join(".", VITE_OUTDIR, "client"),
    chunkSizeWarningLimit: Infinity,
    reportCompressedSize: false,
  },
  plugins: [
    react(),
    TanStackRouterVite(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,jpg,png,svg,avif}"],
      },
      manifest: {
        name: VITE_TITLE,
        short_name: VITE_TITLE,
        description: VITE_TITLE,
        theme_color: VITE_THEME_COLOR_PRIMARY,
        icons: [
          {
            src: VITE_FAVICON,
            sizes: "512x512",
            type: "image/png",
            purpose: ["maskable", "any"],
          },
        ],
      },
    }),
    ServerBuilder(),
  ],
});
