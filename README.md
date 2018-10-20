<p align="center"><img src="https://imgur.com/c6Y4tGw.png" width="150" /></p>

# graphqlgen

[![CircleCI](https://circleci.com/gh/prisma/graphqlgen.svg?style=shield)](https://circleci.com/gh/prisma/graphqlgen) [![npm version](https://badge.fury.io/js/graphqlgen.svg)](https://badge.fury.io/js/graphqlgen)

> Generate & scaffold type-safe resolvers based on your GraphQL Schema in TypeScript, Flow & Reason

<Details>
  <Summary>Note: Using <code>graphqlgen</code> in production</Summary>
While `graphqlgen` is ready to be used in production, it's still in active development and there might be breaking changes before it hits 1.0. Most changes will just affect the configuration and generated code layout but not the behaviour of the code itself.
</Details>

## Features

- **🚀 Schema-first:** Based on your GraphQL schema (SDL) & model definitions
- **🤝 Type-safe:** Strong mapping between your GraphQL schema and resolvers, input arguments and models
- **♻️ Codegen & scaffolding workflows:** Minimal resolver boilerplate & automatically generated type definitions
- **😍 Awesome DX:** Auto-completion & Intellisense in VSCode, Webstorm, Atom, VIM & other editors
- **💅 Ecosystem compatibility:** Supports [prettier](https://github.com/prettier/prettier), [graphql-import](https://github.com/prisma/graphql-import) and [graphql-config](https://github.com/prisma/graphql-config) out of the box

## Motivation

Programming in type-safe environments provides a lot of benefits and gives you confidence about your code. **`graphqlgen` leverages the strongly typed GraphQL schema with the goal of making your backend type-safe while reducing the need to write boilerplate through code generation.**


#### Supported languages:

- `TypeScript`
- `Flow` ([coming soon](https://github.com/prisma/graphqlgen/issues/130))
- `Reason` ([coming soon](https://github.com/prisma/graphqlgen/issues/130))

## Install

You can install the `graphqlgen` CLI with the following command: 

```bash
npm install -g graphqlgen
```

## Usage

Once installed, you can invoke the CLI as follows:

```
graphqlgen
```

The invocation of the command depends on a configuration file called `graphqlgen.yml` which **must be located in the directory where `graphqlgen` is invoked**. Here is an example:

```yml
language: typescript

schema: ./src/schema.graphql
context: ./src/types.ts:Context
models:
  User: ./src/generated/prisma-client/index.ts:UserNode
  Post: ./src/generated/prisma-client/index.ts:PostNode

output: ./src/generated/graphqlgen.ts

resolver-scaffolding:
  output: ./src/generated/tmp-resolvers/
  layout: file-per-type
```

## Configuration: `graphqlgen.yml`

> The `graphqlgen.yml`configuration file  is only required for [Generation](#generation) and [Resolver scaffolding](#scaffolding). [Bootstrapping](#bootstrapping) a GraphQL server is done via `npm init graphqlgen` and doesn't require the `graphqlgen` CLI to be installed. 

### Name

The configuration file must be called **`graphqlgen.yml`**.

### Reference

- `language`: The target programming language for the generated code. Popssible values: `typescript`.
- `schema`: The file path pointing to your GraphQL schema file.
- `context`: Points to the definition of the `context` object that's passed through your GraphQL resolver chain.
- `models`: An object mapping types from your GraphQL schema to the models defined in your programming language. Learn more about [_models_](#models).
- `output`: Specifies where the generated type definitions and _default_ resolver implementations should be located. Must point to a **single file**.
- `resolver-scaffolding`: An object with two properties
  - `output`: Specifies where the scaffolded resolvers should be located. Must point to a **directory**.
  - `layout`: Specifies the [_layout_](#layouts) for the generated files. Possible values: `single-file`, `file-per-type`, `single-file-classes`, `file-per-type-classes`. 

Whether a property is required or not depends on whether you're doing [Generation](#generation) or [Scaffolding](#scaffolding).

### Models

Models represent domain objects in TypeScript:

- Models are **not necessarily** 1-to-1 mappings to your database structures, **but can be**.
- Models are **not necessarily** the types from your GraphQL schema, **but can be**.

When starting a new project, it is often the case that models look _very_ similar to to the SDL types in your GraphQL schema. Only as a project grows, it is often useful to decouple the TypeScript representation of an object from the way it's exposed through the API.

Consider an example where you have a `User` model with a `password` field. The `password` field most likely should not be exposed through the API, but it's still required within yout code. In that case, the model differs from the SDL type representation in the GraphQL schema.

### Layouts

There are four layouts that can be applied when scaffolding resolver skeletons:

- `single-file`: Generates _all_ resolvers in a single file.
- `file-per-type`: Generates one file per SDL type and puts the corresponding resolvers into it. 
- `single-file-classes`: Same as `single-file` but generates resolvers as TypeScript classes instead of plain objects.
- `file-per-type-classes`: Same as `file-per-type` but generates resolvers as TypeScript classes instead of plain objects.

## Generation

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

<Details>
  <Summary>See full example</Summary>

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
  User: ./src/models.ts:User
output: ./src/generated/graphqlgen.ts
resolver-scaffolding:
  output: ./src/tmp/
  layout: file-per-type
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

export namespace MutationResolvers {
  export const defaultResolvers = {};

  export interface ArgsCreateUser {
    name: string | null;
  }

  export type CreateUserResolver = (
    parent: {},
    args: ArgsCreateUser,
    ctx: Context,
    info: GraphQLResolveInfo
  ) => User | Promise<User>;

  export interface Type {
    createUser: (
      parent: {},
      args: ArgsCreateUser,
      ctx: Context,
      info: GraphQLResolveInfo
    ) => User | Promise<User>;
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
  Mutation: MutationResolvers.Type;
  User: UserResolvers.Type;
}

```

</Details>

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
  name: (parent: User) => parent.name
};
```

Note that the default resolvers can be omitted in the vanilla JavaScript version of GraphQL, they're only required when using TypeScript! [Learn more](https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e/).

## Scaffolding Resolvers

> **IMPORTANT**: Scaffolded resolvers are typically generated into a _temporary_ directory and manually copied over into your actual source files. After the generated resolver sceletons have been copied over, the generated files can be deleted.

This feature increases your productivity by generating the boilerplate resolver sceletons for those fields that are not [default resolvers](#default-resolvers). A great example for this are the resolvers for your [_root types_](https://www.prisma.io/blog/graphql-server-basics-the-schema-ac5e2950214e/): `Query`, `Mutation` and `Subscription`.

For fields on these types, the resolver implementation needs to call out to some data source (e.g. a database, a REST API or a Prisma service) and therefore can not be automatically generated by `graphqlgen`. However, `graphqlgen` is able to reduce the amount of boilerplate you need to write by generating resolver "sceletons".

Consider the following `Query` type:

```graphql
type Query {
  user(id: ID!): User
}
```

The resolver sceleton for the `user` field will look similar to this:

```ts
export const Query: QueryResolvers.Type = {
  user: (parent, args) => null
};
```

With that boilerplate in place, all that's left to do for the developer is implement fetching the requested `User` object from some data source (guided by the generated typings for resolver arguments and return values).

The relevant properties from `graphqlgen.yml` for the Generation feature are:

- `language` (required)
- `schema` (required)
- `models` (required)
- `context` (optional)
- `output` (required)
- `resolver-scaffolding` (required)

### Example

<Details>
  <Summary>See full example</Summary>

#### Setup

Assume you have the following minimal setup with three files:

**`./src/schema.graphql`**

```graphql
type Query {
  user(id: ID!): User
}

type Mutation {
  createUser(name: String): User!
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
  User: ./src/models.ts:User
output: ./src/generated/graphqlgen.ts
resolver-scaffolding:
  output: ./src/tmp/
  layout: file-per-type
```

#### Generated code

After running `$ graphqlgen` in your terminal, the following code will be generated into **`./src/tmp/`**:

**`./tmp/User.ts`**

```ts
import { UserResolvers } from "./src/generated/graphqlgen.ts";

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers
};
```

**`./tmp/Query.ts`**

```ts
import { QueryResolvers } from "./src/generated/graphqlgen.ts";

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,
  user: (parent, args) => null
};
```

**`./tmp/Mutation.ts`**

```ts
import { MutationResolvers } from "./src/generated/graphqlgen.ts";

export const Mutation: MutationResolvers.Type = {
  ...MutationResolvers.defaultResolvers,
  createUser: (parent, args) => {
    throw new Error("Resolver not implemented");
  }
};
```

**`./tmp/index.ts`**

```ts
import { Resolvers } from "./src/generated/graphqlgen.ts";

import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { User } from "./User";

export const resolvers: Resolvers = {
  Query,
  Mutation,
  User
};
```

Note the following:

- The paths in the `import` statements will likely need to be adjusted depending on your file structure. 

</Details>

## Bootstrapping

You can bootstrap an entire GraphQL server based on one of the available [templates]((./packages/graphqlgen-templates/)) using [`npm init`](https://docs.npmjs.com/cli/init):

```
npm init graphqlgen ./my-graphql-server
```

Then start the server: 

```
cd my-graphql-server
yarn start
```

## Support

- [Create a feature request](https://github.com/prisma/graphqlgen/issues/new?template=feature_request.md&labels=enhancement)
- [Create a bug report](https://github.com/prisma/graphqlgen/issues/new?template=bug_report.md&labels=bug)

## Credits

- [**gqlgen**](https://github.com/99designs/gqlgen) is the Golang equivalent of `graphqlgen` and served as a source of inspiration
