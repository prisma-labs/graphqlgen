import { UserResolvers } from "../generated/graphqlgen";
import { Context } from "../types";

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,

  posts: (parent, args, ctx: Context) => {
    const { postIDs } = parent
    return ctx.data.posts.filter(post => postIDs.includes(post.id) )
  }
};