# Bootstrapping

You can bootstrap an entire GraphQL server based on one of the available [templates](https://github.com/prisma/graphqlgen/tree/master/packages/graphqlgen-templates) using [`npm init`](https://docs.npmjs.com/cli/init):

```
npm init graphqlgen ./my-graphql-server
```

To choose between one of the available templates, use the `--template` or `-t` option

```
npm init graphqlgen ./my-graphql-server --template flow-yoga
```

Then start the server:

```
cd my-graphql-server
yarn start
```

