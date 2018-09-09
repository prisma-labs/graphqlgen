> **Note:** This project is still WIP.

### Introduction

Generate TS Resolvers

### Feature

1. Autogenerate resolver types
1. Supports `graphql-import`
1. Suports `prettier` i.e. code is generated following the code styling practices of your project.

### Usage

```bash
graphql-resolver-codegen --help
Usage: graphql-resolver-codegen <command> -s [schema-path] -o [output-path] -g [generator] -i
[interfaces]

Options:
  --help             Show help                                         [boolean]
  --version          Show version number                               [boolean]
  -s, --schema-path  GraphQL schema file path                         [required]
  -o, --output       Output file/folder path [default:
                     ./generated/resolvers[.ts]]
  -g, --generator    Generator to use [default: typescript, options: reason]
  -i, --interfaces   Path to the interfaces folder used for scaffolding
  -f, --force        Force write files when there is a clash while scaffolding

  Possible commands: scaffold, interfaces
```

### Commands

| Command    | Description                                                                                   | Flag -s              | Flag -o                                 | Flag -g    | Flag -i                               | Flag -f                                                                  |
| ---------- | --------------------------------------------------------------------------------------------- | -------------------- | --------------------------------------- | ---------- | ------------------------------------- | ------------------------------------------------------------------------ |
| interfaces | Generate type safe interfaces for resolvers based on your schema.                              | Path to input schema | Path to generate interfaces file at     | typescript | NA                                    | NA                                                                       |
| scaffold   | Scaffold resolvers based on your schema that rely on the generated interface for type safety. | Path to input schema | Path to folder for generating resolvers | typescript | Path to the generated interfaces file | Force write resolver files when there is a collision with existing files |

Note: while using `scaffold`, types.ts will always be generated irrespective of `-f` flag.

### Example

##### To generate both resolvers and typings for a given GraphQL schema, run the following commands

1. Run `graphql-resolver-codegen interfaces -s <schema-path> -o <output-path>/generated/resolvers.ts -g typescript`

1. Run `graphql-resolver-codegen scaffold -s <schema-path> -o <output-path> -g typescript -i <output-path>/generated/resolvers.ts`

Not the `scaffold` command take an additional argument `i` which adds import for generated `interfaces` in scaffolded code.

To see an example in action, please open the [`example`](https://github.com/prisma/graphql-resolver-codegen/tree/master/example) directory.

### Design Decisions

1. Code generator imports all the generated types interfaces and exports a collective `Types` interface in `types.ts`.

1. Interface for `Context` is generated in a separate file called `Context.ts`.

1. The command `scaffold` always writes the `types.ts` file, irrespective of the `-f` flag.
