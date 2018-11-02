// @flow
import { Post_defaultResolvers } from '../generated/graphqlgen'
import type { PostResolvers } from '../generated/graphqlgen'

export const Post: PostResolvers = {
  ...Post_defaultResolvers,

  author: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
}
