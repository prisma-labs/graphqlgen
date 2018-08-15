### Introduction

Generate TS Resolvers

### Feature

1. Autogenerate resolver types
1. Supports `graphql-import`

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
```
