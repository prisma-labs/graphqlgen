### Introduction

Generate TS Resolvers

### Feature

1. Autogenerate resolver types
1. Supports `graphql-import`
1. Suports `prettier` i.e. code is generated following the code styling practices of your project.

### Usage

```bash
graphql-resolver-codegen --help
Usage: <command> graphql-resolver-codegen -s [schema-path] -o [output-path] -g [generator] -i
[interfaces]

Options:
  --help             Show help                                         [boolean]
  --version          Show version number                               [boolean]
  -s, --schema-path  GraphQL schema file path                         [required]
  -o, --output       Output file/folder path [default:
                     ./generated/resolvers[.ts]]
  -g, --generator    Generator to use [default: typescript, options: reason]
  -i, --interfaces   Path to the interfaces folder used for scaffolding

  Possible commands: scaffold, interfaces
```

### Example

##### To generate both resolvers and typings for a given GraphQL schema, run the following commands

1. Run graphql-resolver-codegen scaffold -s <schema-path> -o <output-path>/generated/resolvers.ts -g typescript

1. Run graphql-resolver-codegen scaffold -s <schema-path> -o <output-path> -g typescript -i <output-path>/generated/resolvers.ts

Not the `scaffold` command take an additional argument `i` which adds import for generated `interfaces` in scaffolded code.
