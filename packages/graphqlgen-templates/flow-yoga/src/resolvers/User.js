// @flow
import { User_defaultResolvers } from '../generated/graphqlgen'
import type { User_Resolvers } from '../generated/graphqlgen'

export const User: User_Resolvers = {
  ...User_defaultResolvers,
  posts: ({ postIDs }, args, ctx, info) => {
    return ctx.data.posts.filter(post => postIDs.includes(post.id))
  },
}
