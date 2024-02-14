import { z } from "zod";
import { authorizedProcedure } from "./_authorized";

export const secret = authorizedProcedure
  .input(z.string().nullish())
  .output(z.string())
  .query((opts) => `secret ${opts.input ?? opts.ctx.session.name ?? "world"}`);
