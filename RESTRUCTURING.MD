# Restructure Grahqlgen

> Warning : This PR introduces a lot of changes. Please check the following fork before proceeding.

- Repo : https://github.com/iamvishnusankar/graphqlgen

- `yarn install`
- `yarn build` & `yarn test`

This PR adds the support for following features:

- Predefined folder structures
- Default config (No config setup)
- Multiple schema files `./src/graphql/schemas/**.graphql` (#224)
- Third party provider support

## Predefined folder structure

```
src
    graphql

        __generated__
            tmp-resolvers
            schema.graphql
            graphqlgen.ts

        models
            context.ts
            file1.ts
            file2.ts

        resolvers
            resolver1.ts
            resolver2.ts

        schemas
            schema1.graphql
            schema2.graphql
            schema3.graphql
```

## Default config

```json
{
  "context": "./src/graphql/models/context.ts:Context",
  "language": "typescript",
  "models": {
    "files": ["./src/graphql/models/**.ts"]
  },
  "output": "./src/graphql/__generated__/graphqlgen.ts",
  "resolver-scaffolding": {
    "layout": "file-per-type",
    "output": "./src/graphql/__generated__/tmp-resolvers"
  },
  "schema": "./src/graphql/schemas/**.graphql",
  "schema-output": "./src/graphql/__generated__/schema.graphql"
}
```

## Multiple schema files
