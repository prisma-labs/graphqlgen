## Introduction

`graphqlgen` is a CLI that translate GraphQL schemas into scaffolded resolver implementations and type definitions. It currently supports **TypeScript** (more languages will be added soon).

These are the main benefits provided by   graphqlgen`:

- Map GraphQL schema to resolver implementation
- Type-safe data flow inside of resolvers (resolver return value and `parent` value)
- Auto-completion & error-catching on resolver arguments as well as on return & `parent` values

## Features

There are three major features supported by `graphqlgen`:

- [**Generation**](#generation) of type definitions and _default_ resolver implementations
- [**Scaffolding**](#scaffolding) resolver sceletons (optional)
- [**Bootstrapping**](#bootstrapping) a GraphQL server based on a [template](packages/graphqlgen-templates/) (optional)

More features are:

- Supports `graphql-import`
- Suports `prettier` (code is generated following the code styling practices of your project)


## Install

You can install the `graphqlgen` CLI with the following command: 

```
npm install -g graphqlgen
```

## Usage

Once installed, you can invoke the CLI as follows:

```
graphqlgen
```

The invocation of the command depends on a configuration file called `graphqlgen.yml` which **must be located in same the directory where `graphqlgen` is invoked**. Here is an example:

```yml
language: typescript

schema: ./src/schema.graphql
context: ./src/types.ts:Context
models:
  User: ./src/generated/prisma-client/index.ts:UserNode
  Post: ./src/generated/prisma-client/index.ts:PostNode

output: ./src/generated/graphqlgen.ts

resolver-scaffolding:
  output: ./src/tmp-resolvers/
  layout: single-file
```

## Configuration: `graphqlgen.yml`

### Name

The configuration file must be called **`graphqlgen.yml`**.

### Reference

- `language`: The target programming language for the generated code. Popssible values: `typescript`.
- `schema`: The file path pointing to your GraphQL schema file.
- `models`: An object mapping types from your GraphQL schema to the models defined in your programming language. Learn more about [models](#models).
- `output`: Specifies where the generated type definitions and _default_ resolver implementations should be located. Muist point to a **single file**.
- `resolver-scaffolding`: An object with two properties
  - `output`: Specifies where the scaffolded resolvers should be located. Must point to a **directory**.
  - `layout`: Specifies the _layout_ for the generated files. Possible values: `single-file`, `file-per-type`, `single-file-classes`, `file-per-type-classes`. 

### Models

Models represent domain objects in TypeScript:

- Models are **not** necessarily 1-to-1 mappings to your database structures, but can be.
- Models are **not** necessarily the types from your GraphQL schema, but can be.

> When starting a new project, it is often the case that models look _very_ similar to database structures as well as to the types in your GraphQL schema. Only as a project grows, it is often useful to decouple the TypeScript representation of an object from its underlying database structure.

Consider an example where you have a `User` table in your database that has a `password` column. The `password` field most likely wouldn't be represented on the `User` instance you want to work with in your TypeScript code since you don't want to expose that. In that case, the model differs from the database representation and might similarly differ from its definition in the GraphQL schema.

### Layouts

There are four layouts that can be applied when scaffolding resolver skeletons:

## Generation

## Scaffolding

The 

## Bootstrapping

## Design Decisions

1. Code generator imports all the generated types interfaces and exports a collective `Types` interface in `typemap.ts`.
1. Interface for `Context` is generated in a separate file called `Context.ts`.
1. The command `scaffold` always writes the `typemap.ts` file, irrespective of the `-f` flag.

## Support

- [Create a feature request](https://github.com/prisma/graphql-resolver-codegen/issues/new?template=feature_request.md&labels=enhancement)
- [Create a bug report](https://github.com/prisma/graphql-resolver-codegen/issues/new?template=bug_report.md&labels=bug)
