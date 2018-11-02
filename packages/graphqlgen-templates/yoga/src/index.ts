import { GraphQLServer } from 'graphql-yoga'
import { resolvers } from './graphql'
import { data } from './data'

const server = new GraphQLServer({
  typeDefs: './src/graphql/__generated__/schema.graphql',
  resolvers,
  context: { data },
} as any)

server.start(() => console.log('Server is running on http://localhost:4000'))
