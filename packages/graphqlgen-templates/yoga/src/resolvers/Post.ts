import { PostResolvers } from "../generated/graphqlgen";
import { Context } from "../types";

export const Post: PostResolvers.Type = {
  ...PostResolvers.defaultResolvers,

  author: (parent, args, ctx: Context) => {
    return ctx.data.users.find(user => user.id === parent.id)
  }
};