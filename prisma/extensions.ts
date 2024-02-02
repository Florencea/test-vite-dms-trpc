import { createId } from "@paralleldrive/cuid2";
import { Prisma } from "@prisma/client";
import argon2 from "argon2";

export const cuid2Extension = () => {
  return Prisma.defineExtension({
    name: "cuid2",
    query: {
      $allModels: {
        create: async ({ args, query }) => {
          const id = createId();
          args.data = { ...args.data, id };
          return query(args);
        },
        upsert: async ({ args, query }) => {
          const id = createId();
          args.create = {
            ...args.create,
            id,
          };
          return query(args);
        },
      },
    },
  });
};

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
