// @flow
import { User_defaultResolvers } from '../generated/graphqlgen'
import type { UserResolvers } from '../generated/graphqlgen'

export const User: UserResolvers = {
  ...User_defaultResolvers,
  posts: ({ postIDs }, args, ctx, info) => {
    return ctx.data.posts.filter(post => postIDs.includes(post.id))
  },
}
