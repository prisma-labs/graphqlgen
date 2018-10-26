# Generation

> **IMPORTANT**: The generated typings and default resolver implementations are all stored in a single file which should never be edited!

The goal of this feature is to make your resolvers type-safe! Without a tool like `graphqlgen`, type-safe resolvers would require you to write huge amounts of boilerplate to keep your GraphQL schema in sync with your TypeScript type definitions, which is a cumbersome and error-prone process.

For each model, `graphqlgen` generates the following:

- Type definitions for resolver arguments and return value
- Default resolver implementations

The relevant properties from `graphqlgen.yml` for the Generation feature are:

- `language` (required)
- `schema` (required)
- `models` (required)
- `context` (optional)
- `output` (required)

### Example

#### Setup

Assume you have the following minimal setup with three files:

**`./src/schema.graphql`**

```graphql
type Query {
  user(id: ID!): User
}

type User {
  id: ID!
  name: String
}
```

**`./src/models.ts`**

```ts
export interface User {
  id: string
  name: string | null
  password: string
}
```

**`./graphqlgen.yml`**

```yml
language: typescript
schema: ./src/schema.graphql
models:
  files:
    - ./src/models.ts
output: ./src/generated/graphqlgen.ts
```

#### Generated code

After running `$ graphqlgen` in your terminal, the following:

**`./src/generated/graphqlgen.ts`**

```ts
import { GraphQLResolveInfo } from "graphql";
type Context = any;
import { User } from "../models";

export namespace QueryResolvers {
  export const defaultResolvers = {};

  export interface ArgsUser {
    id: string;
  }

  export type UserResolver = (
    parent: {},
    args: ArgsUser,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => User | null | Promise<User | null>;

  export interface Type {
    user: (
      parent: {},
      args: ArgsUser,
      ctx: Context,
      info: GraphQLResolveInfo
    ) => User | null | Promise<User | null>;
  }
}

export namespace UserResolvers {
  export const defaultResolvers = {
    id: (parent: User) => parent.id,
    name: (parent: User) => parent.name
  };

  export type IdResolver = (
    parent: User,
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | Promise<string>;

  export type NameResolver = (
    parent: User,
    args: {},
    ctx: Context,
    info: GraphQLResolveInfo
  ) => string | null | Promise<string | null>;

  export interface Type {
    id: (
      parent: User,
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | Promise<string>;

    name: (
      parent: User,
      args: {},
      ctx: Context,
      info: GraphQLResolveInfo
    ) => string | null | Promise<string | null>;
  }
}

export interface Resolvers {
  Query: QueryResolvers.Type;
  User: UserResolvers.Type;
}
```

### Type Definitions

This is required to make your resolvers type safe. Type definitions are generated for the resolvers' return values as well as for the first three resolver arguments:

1. `parent`: The return value of the previous resolver execution level. [Learn more](https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e/).
1. `args`: The query parameters provided by the client who submitted the query.
1. `context`: An object to be passed through the GraphQL resolver chain.

### Default resolvers

Default resolvers are trivial resolver implementations where the fields from the `parent` arguments are immediately returned. Consider for the example the following `User` type in a GraphQL schema:

```graphql
type User {
  id: ID!
  name: String
}
```

The default resolvers for that type look as follows:

```ts
export const defaultResolvers = {
  id: (parent: User) => parent.id,
  name: (parent: User) => parent.name,
}
```

Note that the default resolvers can be omitted in the vanilla JavaScript version of GraphQL, they're only required when using TypeScript! [Learn more](https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e/).
