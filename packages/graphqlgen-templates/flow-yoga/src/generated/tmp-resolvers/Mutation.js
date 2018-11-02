/* @flow */
import type { MutationResolvers } from '../graphqlgen.js'

export const Mutation: MutationResolvers = {
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
