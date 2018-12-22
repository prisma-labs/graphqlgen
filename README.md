<p align="center"><img src="https://imgur.com/c6Y4tGw.png" width="150" /></p>

# graphqlgen

[![CircleCI](https://circleci.com/gh/prisma/graphqlgen.svg?style=shield)](https://circleci.com/gh/prisma/graphqlgen) [![npm version](https://badge.fury.io/js/graphqlgen.svg)](https://badge.fury.io/js/graphqlgen)

> Generate & scaffold type-safe resolvers based on your GraphQL Schema in TypeScript, Flow & Reason

## Features

- **🚀 Schema-first:** Based on your GraphQL schema (SDL) & model definitions
- **🤝 Type-safe:** Strong mapping between your GraphQL schema and resolvers, input arguments and models
- **♻️ Codegen & scaffolding workflows:** Minimal resolver boilerplate & automatically generated type definitions
- **😍 Awesome DX:** Auto-completion & Intellisense in VSCode, Webstorm, Atom, VIM & other editors
- **💅 Ecosystem compatibility:** Supports [prettier](https://github.com/prettier/prettier) and [graphql-import](https://github.com/prisma/graphql-import) out of the box

## Documentation

You can find the docs for the `graphqlgen` CLI [here](https://oss.prisma.io/graphqlgen/).

## Motivation

Programming in type-safe environments provides a lot of benefits and gives you confidence about your code. `graphqlgen` leverages the strongly typed GraphQL schema with the goal of making your backend type-safe while reducing the need to write boilerplate through code generation.

#### Supported languages:

- `TypeScript`
- `Flow`
- `Reason` ([coming soon](https://github.com/prisma/graphqlgen/issues/253))

## Get started

### Start from scratch

Bootstrap a GraphQL server based with a ready-made `graphqlgen` setup then
start the server:

_With `npm`_

```bash
npm init graphqlgen my-app
cd my-app
npm start
```

_Note: `npm init` requires npm version >= 6.2.0_

or

_With `yarn`_

```bash
yarn create graphqlgen my-app
cd my-app
yarn start
```

_Note: `yarn create` requires yarn version >= 0.25_

After updating the GraphQL schema in `./my-app/src/schema.graphql`, execute the `graphqlgen` CLI to update all resolvers:

```
graphqlgen
```

### Add to existing project

#### Install

You can install the `graphqlgen` CLI with either of the following commands:

```bash
npm install -g graphqlgen
```

or

```bash
yarn global add graphqlgen
```

#### Usage

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
  files:
    - ./src/generated/prisma-client/index.ts

output: ./src/generated/graphqlgen.ts

resolver-scaffolding:
  output: ./src/generated/tmp-resolvers/
  layout: file-per-type
```

Learn more about the configuration in the [docs](https://oss.prisma.io/graphqlgen/01-configuration.html).

## Support

- [Create a feature request](https://github.com/prisma/graphqlgen/issues/new?template=feature_request.md&labels=enhancement)
- [Create a bug report](https://github.com/prisma/graphqlgen/issues/new?template=bug_report.md&labels=bug)

<Details><Summary><b>Note: Using <code>graphqlgen</code> in production</b></Summary>
<br />

While `graphqlgen` is ready to be used in production, it's still in active development and there might be breaking changes before it hits 1.0. Most changes will just affect the configuration and generated code layout but not the behaviour of the code itself.

</Details>

## Credits

- [**gqlgen**](https://github.com/99designs/gqlgen) is the Golang equivalent of `graphqlgen` and served as a source of inspiration
- [**graphql-code-generator**](https://github.com/dotansimha/graphql-code-generator) is a similar tool based on templates support both frontend & backend

## Help & Community [![Slack Status](https://slack.prisma.io/badge.svg)](https://slack.prisma.io)

Join the `#graphqlgen` channel our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

<p align="center"><a href="https://oss.prisma.io"><img src="https://imgur.com/IMU2ERq.png" alt="Prisma" height="170px"></a></p>
