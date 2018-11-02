/* @flow */
import type { Resolvers } from '../graphqlgen.js'

import { Query } from './Query'
import { Post } from './Post'
import { User } from './User'
import { Mutation } from './Mutation'

export const resolvers: Resolvers = {
  Query,
  Post,
  User,
  Mutation,
}
