import { z } from "zod";
import { publicProcedure } from "./_unauthorized";

export const hello = publicProcedure
  .input(z.string().nullish())
  .output(z.string())
  .query((opts) => {
    return `${opts.ctx.req.t("hello")} ${opts.input ?? opts.ctx.session.name ?? "world"}`;
  });
