import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getSession } from "../utils/server";

export async function createContext(opts: CreateExpressContextOptions) {
  const session = await getSession(opts);
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
