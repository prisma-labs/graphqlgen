<p align="center"><img src="https://imgur.com/c6Y4tGw.png" width="150" /></p>

# graphqlgen <!-- omit in toc -->

[![CircleCI](https://circleci.com/gh/prisma/graphqlgen.svg?style=shield)](https://circleci.com/gh/prisma/graphqlgen) [![npm version](https://badge.fury.io/js/graphqlgen.svg)](https://badge.fury.io/js/graphqlgen)

Generate & scaffold type-safe resolvers based on your GraphQL Schema in TypeScript, Flow & Reason

## Deprecation note

`graphqlgen` has been officially deprecated in favor of the [The Guild](http://the-guild.dev)'s project [GraphQL Code Generator](https://graphql-code-generator.com/). Learn more about the collaboration of Prisma and the Guild in [this]( https://www.prisma.io/blog/the-guild-takes-over-oss-libraries-vvluy2i4uevs) blog post.

---

- [About](#about)
  - [Highlights](#highlights)
  - [Motivation](#motivation)
  - [Supported languages](#supported-languages)
- [Getting started](#getting-started)
  - [Try out a project initializer](#try-out-a-project-initializer)
  - [Add to existing project](#add-to-existing-project)
  - [Documentation](#documentation)
- [Addendum](#addendum)
  - [Community](#community)
  - [Project Status](#project-status)
  - [Prior Art](#prior-art)

## About

### Highlights

- **Schema-first** Design in SDL to derive ideal types
- **Type-safety** Resolvers with precise signatures including `parent`, `args` and return type
- **DX** Precise resolver types puts your editor intellisense to work
- **Ecosystem Interop** codegen suitable for Yoga 1 or Apollo Server and supports [prettier](https://github.com/prettier/prettier) and [graphql-import](https://github.com/prisma/graphql-import) out of the box

### Motivation

Programming in type-safe environments can contribute toward great confidence in your code's integrity. `graphqlgen` aims to leverage the GraphQL type system to make your resolvers completely type-safe. This is important because resolvers are the heart of any graphql service and yet the hardest to statically type due to their dynaminism.

### Supported languages

- `TypeScript`
- `Flow`

Others under discussion:

- [`reason`](https://github.com/prisma/graphqlgen/issues/253)

## Getting started

### Try out a project initializer

1. Run initializer

   ```bash
   yarn create graphqlgen my-app # npm init graphqlgen my-app
   cd my-app
   yarn start # npm run start
   ```

2. Edit `./my-app/src/schema.graphql` to your heart's content.

3. Generate types:

   ```
   yarn graphqlgen
   ```

### Add to existing project

```bash
yarn add --dev graphqlgen # npm install --save-dev graphqlgen
```

Then you will have access to the cli (`gg` or `graphqlgen`):

```bash
yarn -s gg --help # npm run gg --help
```

```
Usage: graphqlgen or gg

Options:
  -i, --init     Initialize a graphqlgen.yml file
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

`gg` depends on the presence of a `graphqlgen.yml` config **located in the directory where `gg` is invoked**. Here is an example:

```yml
language: typescript
schema: ./src/schema.graphql
context: ./src/context.ts:Context
output: ./src/generated/graphqlgen.ts
models:
  files:
    - ./src/generated/prisma-client/index.ts
```

### Documentation

https://oss.prisma.io/graphqlgen

## Addendum

### Community

Join us at `#graphqlgen` in our [Slack group](https://slack.prisma.io) and if you have more fleshed out ideas, bug reports etc. create a Github issue:

- [feature request](https://github.com/prisma/graphqlgen/issues/new?template=feature_request.md&labels=enhancement)
- [bug report](https://github.com/prisma/graphqlgen/issues/new?template=bug_report.md&labels=bug)

### Project Status

`graphqlgen` is still in early stage development where breaking changes and tool design are a fluid matter. Feedback is deeply appreciated. You may feel comfortable giving it a try on production systems since there is no runtime aspect and hence quite safe to do so (save for a few optional default resolvers).

### Prior Art

- [**gqlgen**](https://github.com/99designs/gqlgen) is the Golang equivalent of `graphqlgen` and served as a source of inspiration
- [**graphql-code-generator**](https://github.com/dotansimha/graphql-code-generator) is a similar tool based on templates support both frontend & backend

<p align="center"><a href="https://oss.prisma.io"><img src="https://imgur.com/IMU2ERq.png" alt="Prisma" height="170px"></a></p>
