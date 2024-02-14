import type { User } from "@prisma/client";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getIronSession } from "iron-session";
import { COOKIE_NAME, COOKIE_SECRET } from "../server/config";

export const getSession = (opts: CreateExpressContextOptions) =>
  getIronSession<Partial<Pick<User, "id" | "account" | "name">>>(
    opts.req,
    opts.res,
    {
      password: COOKIE_SECRET,
      cookieName: COOKIE_NAME,
    },
  );
