/* @flow */
import type { Resolvers } from '../graphqlgen'

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
