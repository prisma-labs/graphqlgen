// @flow
import { Query_defaultResolvers } from '../generated/graphqlgen'
import type { QueryResolvers } from '../generated/graphqlgen'

export const Query: QueryResolvers = {
  ...Query_defaultResolvers,

  feed: (parent, args, ctx) => {
    return ctx.data.posts.filter(post => post.published)
  },

  drafts: (parent, args, ctx) => {
    return ctx.data.posts.filter(post => !post.published)
  },

  post: (parent, args, ctx) => {
    return ctx.data.posts.find(post => post.id === args.id) || null
  },
}
