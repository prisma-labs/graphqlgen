// @flow
import { Post_defaultResolvers } from '../generated/graphqlgen'
import type { Post_Resolvers } from '../generated/graphqlgen'

export const Post: Post_Resolvers = {
  ...Post_defaultResolvers,

  author: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
}
