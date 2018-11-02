/* @flow */
import type { Mutation_Resolvers } from '../graphqlgen'

export const Mutation: Mutation_Resolvers = {
  createUser: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
  createDraft: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
  deletePost: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
  publish: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
}
