import { TRPCError, initTRPC } from "@trpc/server";
import { verify } from "argon2";
import { z } from "zod";
import { prisma } from "../../../prisma";
import type { Context } from "../context";
import { authorizedProcedure } from "./_authorized";
import { publicProcedure } from "./_unauthorized";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const login = publicProcedure
  .input(
    z
      .object({
        account: z.string(),
        password: z.string(),
      })
      .required(),
  )
  .output(z.void())
  .mutation(async (opts) => {
    await delay(3000);
    const { account, password } = opts.input;
    const user = await prisma.user.findUnique({ where: { account } });
    if (!user)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: opts.ctx.t("auth.user not found", { ns: "server" }),
      });
    const match = await verify(user.password, password);
    if (!match)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: opts.ctx.t("auth.wrong password", { ns: "server" }),
      });
    opts.ctx.session.id = user.id;
    opts.ctx.session.account = user.account;
    opts.ctx.session.name = user.name;
    await opts.ctx.session.save();
    return;
  });

const logout = authorizedProcedure
  .input(z.void())
  .output(z.void())
  .mutation(async (opts) => {
    opts.ctx.session.destroy();
    return;
  });

const beacon = publicProcedure
  .input(z.void())
  .output(z.boolean())
  .mutation((opts) => {
    return !!opts.ctx.session.id;
  });

const info = authorizedProcedure
  .input(z.void())
  .output(
    z
      .object({
        userName: z.string(),
      })
      .required(),
  )
  .query(async (opts) => {
    return { userName: opts.ctx.session.name ?? "" };
  });

export const auth = initTRPC.context<Context>().create().router({
  login,
  logout,
  beacon,
  info,
});
