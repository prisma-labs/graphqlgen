export const typeDefs = `
  type User {
    id: String!
    posts: [Post!]!
  }

  type Post {
    id: String!
  }
`
