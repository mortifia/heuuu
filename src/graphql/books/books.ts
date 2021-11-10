"use strict";

import { IResolvers } from "mercurius";

import pkg from "@prisma/client";
const { PrismaClient } = pkg;

export const resolvers: IResolvers = {
  Query: {
    // books: () => [{ id: 1, title: "loool", author: "roibert" }],
    books: async (_parent, args, ctx) => {
      return ctx;
    },
  },
};
