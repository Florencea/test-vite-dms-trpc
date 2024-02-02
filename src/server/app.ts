import { TRPCError, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import * as jose from "jose";
import { cwd } from "node:process";
import ViteExpress from "vite-express";
import { z } from "zod";
import {
  API_PREFIX,
  BASE,
  IS_PRODCTION,
  JWT_SETTINGS,
  OUTDIR,
  PORT,
  SERVER_READY_MESSAGE,
} from "./config";

// created for each request
const createContext = async ({
  req,
}: trpcExpress.CreateExpressContextOptions) => {
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")?.[1] ?? "";
      const { secretOrKey } = JWT_SETTINGS;
      const secret = new TextEncoder().encode(secretOrKey);
      const { payload } = await jose.jwtVerify(token, secret);
      const user = payload.sub;
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();
  return {
    user,
  };
};
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

const appRouter = t.router({
  // open for anyone
  hello: t.procedure
    .input(z.string().nullish())
    .query((opts) => `hello ${opts.input ?? opts.ctx.user ?? "world"}`),
  // checked in resolver
  secret: t.procedure.query((opts) => {
    if (!opts.ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return {
      secret: "sauce",
    };
  }),
});

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

export type AppRouter = typeof appRouter;
