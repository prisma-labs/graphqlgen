/* @flow */
import { Post_defaultResolvers } from '../graphqlgen.js'
import type { PostResolvers } from '../graphqlgen.js'

export const Post: PostResolvers = {
  ...Post_defaultResolvers,

  author: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
}
