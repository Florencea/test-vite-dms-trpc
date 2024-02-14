import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import { hello } from "./procedure/hello";
import { secret } from "./procedure/secret";

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  hello,
  secret,
});

export type AppRouter = typeof appRouter;
