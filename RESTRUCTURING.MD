# Restructure Grahqlgen

> **Warning** : This PR introduces a lot of changes. Please check the following fork before proceeding.

## Testing the PR

- Clone the repo : https://github.com/iamvishnusankar/graphqlgen

- Run the following command on workspace root
  - `yarn install`
  - `yarn build`
  - `yarn test`
- `cd` into either `packages/graphqlgen-templates/yoga` or `packages/graphqlgen-templates/apollo-server-express-typescript` and run the following commands
  - `yarn generate`
  - `yarn start`

## Features:

- Predefined folder structures.
- Default config (No config setup).
- Multiple schema files `./src/graphql/schemas/**/*.graphql` (#224).
- Third party provider support.

## Predefined folder structure

A predefined folder structure will allow the generator to create all the files without a config file. Scaffolding everything into `src` folder is kind of a pain to manage in larger projects. A predefined root (`src/graphql`) folder will make it modular and possibly help to load or separate the module into multiple packages.

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

Default config favours the above mentioned folder structure. Hence, users wouldn't require to create a `graphqlgen.yml` config file.

If the user is following the default folder structure, Running `yarn graphqlgen` command on package root will generate all files **without** `graphqlgen.yml`.

```json
{
  "context": "./src/graphql/models/context.ts:Context",
  "language": "typescript",
  "models": {
    "files": ["./src/graphql/models/**/*.ts"]
  },
  "output": "./src/graphql/__generated__/graphqlgen.ts",
  "resolver-scaffolding": {
    "layout": "file-per-type",
    "output": "./src/graphql/__generated__/tmp-resolvers"
  },
  "schema": "./src/graphql/schemas/**/*.graphql",
  "schema-output": "./src/graphql/__generated__/schema.graphql"
}
```

For overriding the default config, create `graphqlgen.yml` on the package root and the config parser will deepmerge the custom config with default config. Since the overriding is based on the `deepmerge` library, users would only require to provide the necessary overriding properties in `graphqlgen.yml`.

## Multiple schema files

Writing schema in a single file is really easy when it comes to simple/hobby apps. But for a production-ready/complex app which require a lot of documentation, managing schema in a single file is really painful task.

With this update,`graphqlgen` supports the generation of a single `schema.graphql` file using a glob pattern (#224).

By default `graphqlgen` will generate a `schema.graphql` file under `src/graphql/__generated__` using all the files defined under `src/graphql/schemas/**/*.graphql`.
