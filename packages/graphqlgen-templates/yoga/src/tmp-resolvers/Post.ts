// This resolver file was scaffolded by github.com/prisma/graphqlgen.
// Please do not import this file directly but copy & paste to your application code.

import { PostResolvers } from "./src/generated/graphqlgen.ts";

export const Post: PostResolvers.Type = {
  ...PostResolvers.defaultResolvers,

  author: parent => {
    throw new Error("Resolver not implemented");
  }
};
