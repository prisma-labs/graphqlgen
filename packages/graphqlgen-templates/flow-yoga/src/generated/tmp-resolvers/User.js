/* @flow */
import { User_defaultResolvers } from '../graphqlgen.js'
import type { UserResolvers } from '../graphqlgen.js'

export const User: UserResolvers = {
  ...User_defaultResolvers,

  posts: (parent, args, ctx, info) => {
    throw new Error('Resolver not implemented')
  },
}
