import { TRPCError } from "@trpc/server";
import { publicProcedure } from "./_unauthorized";

export const authorizedProcedure = publicProcedure.use((opts) => {
  if (!opts.ctx.session.id) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "UNAUTHORIZED" });
  }
  return opts.next();
});
