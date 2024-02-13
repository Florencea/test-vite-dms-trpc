import { Prisma } from "@prisma/client";
import argon2 from "argon2";

export const userCreateExtension = () => {
  return Prisma.defineExtension({
    name: "user-create",
    query: {
      user: {
        create: async ({ args, query }) => {
          const password = await argon2.hash(args.data.password);
          args.data = { ...args.data, password };
          return query(args);
        },
        upsert: async ({ args, query }) => {
          const password = await argon2.hash(args.create.password);
          args.create = {
            ...args.create,
            password,
          };
          args.update = {
            ...args.update,
            password,
          };
          return query(args);
        },
      },
    },
  });
};
