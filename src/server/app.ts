import * as trpcExpress from "@trpc/server/adapters/express";
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { cwd } from "node:process";
import ViteExpress from "vite-express";
import {
  API_PREFIX,
  BASE,
  IS_PRODCTION,
  OUTDIR,
  PORT,
  SERVER_READY_MESSAGE,
} from "./config";
import { createContext } from "./context";
import { appRouter } from "./router";

const app = express();

/**
 * Essential middleware
 */
app.disable("x-powered-by");
app.use(cookieParser());
app.use(compression());

/**
 * Secure middleware in prodction
 */
if (IS_PRODCTION) {
  app.use(helmet());
  /**
   * Config for viteless production mode
   */
  ViteExpress.config({
    inlineViteConfig: {
      root: cwd(),
      base: BASE,
      build: { outDir: OUTDIR },
    },
  });
}

/**
 * API controllers
 */
app.use(
  API_PREFIX,
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

ViteExpress.listen(app, PORT, () => {
  console.info(SERVER_READY_MESSAGE);
});
