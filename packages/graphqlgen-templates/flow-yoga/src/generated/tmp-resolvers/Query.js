/* @flow */
import type { Query_Resolvers } from '../graphqlgen'

export const Query: Query_Resolvers = {
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
