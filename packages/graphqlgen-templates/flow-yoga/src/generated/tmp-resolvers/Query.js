/* @flow */
import type { QueryResolvers } from '../graphqlgen.js'

export const Query: QueryResolvers = {
  feed: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
  drafts: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
  post: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
}
