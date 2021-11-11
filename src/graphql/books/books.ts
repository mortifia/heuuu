"use strict";
import { IResolvers } from "mercurius";

export const resolvers: IResolvers = {
  Query: {
    // books: () => [{ id: 1, title: "loool", author: "roibert" }],
    books: async (_parent, args, ctx) => {
      return ctx;
    },
  },
};
