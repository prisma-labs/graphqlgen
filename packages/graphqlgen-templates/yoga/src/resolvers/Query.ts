import { QueryResolvers } from "../generated/graphqlgen";
import { Context } from "../types";
import { createLexer } from "graphql/language";

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,
  feed: (parent, args, ctx: Context) => {
    return ctx.data.posts.filter(post => post.published)
  },
  drafts: (parent, args, ctx: Context) => {
    return ctx.data.posts.filter(post => !post.published)
  },
  post: (parent, args, ctx: Context) => {
    return ctx.data.posts.find(post => post.id === args.id)
  }
};
