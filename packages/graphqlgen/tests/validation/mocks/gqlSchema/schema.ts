import gql from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: String!
    posts: [Post!]!
  }

  type Post {
    id: String!
  }
`
