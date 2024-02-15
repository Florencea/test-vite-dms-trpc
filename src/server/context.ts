import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getSession } from "../utils/server";

export async function createContext(opts: CreateExpressContextOptions) {
  const session = await getSession(opts);
  const req = opts.req;
  return {
    session,
    req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
