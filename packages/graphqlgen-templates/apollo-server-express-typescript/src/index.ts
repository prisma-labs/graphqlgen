import { ApolloServer, gql } from 'apollo-server-express'
import * as express from 'express'
import { importSchema } from 'graphql-import'

import { resolvers } from './graphql'
import { data } from './data'

const app = express()
const PORT = process.env.PORT || 5000

// Import the schema as string
const schema = importSchema(
  './src/graphql/__generated__/graphqlgen.schema.graphql',
)

const apolloServer = new ApolloServer({
  typeDefs: gql(schema),
  resolvers: resolvers as any,
  context: { data },
})

apolloServer.applyMiddleware({
  app,
})

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}`)
})
