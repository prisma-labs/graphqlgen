// This resolver file was scaffolded by github.com/prisma/graphqlgen.
// Please do not import this file directly but copy & paste to your application code.

import { UserResolvers } from "./src/generated/graphqlgen.ts";

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,

  posts: parent => {
    throw new Error("Resolver not implemented");
  }
};
