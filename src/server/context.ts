import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getSession } from "../utils/server";

export async function createContext(opts: CreateExpressContextOptions) {
  const session = await getSession(opts);
  const t = opts.req.t;
  return {
    session,
    t,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
