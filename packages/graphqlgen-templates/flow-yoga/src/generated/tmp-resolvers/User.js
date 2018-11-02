/* @flow */
import { User_defaultResolvers } from '../graphqlgen'
import type { User_Resolvers } from '../graphqlgen'

export const User: User_Resolvers = {
  ...User_defaultResolvers,

  posts: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
}
