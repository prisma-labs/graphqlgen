# Bootstrapping

You can bootstrap an entire GraphQL server based on one of the available [templates](https://github.com/prisma/graphqlgen/tree/master/packages/graphqlgen-templates) using [`npm init`](https://docs.npmjs.com/cli/init):

```
npm init graphqlgen ./my-graphql-server
```

You'll be prompted to choose the server template you want to bootstrap

```
? What GraphQL server template do you want to bootstrap? (Use arrow keys)

❯ yoga (GraphQL Yoga template with typescript)
  flow-yoga (GraphQL Yoga template with flow)
```

Or provide the `--template` option to configure the template you want to bootstrap

```
npm init graphqlgen ./my-graphql-server --template yoga
```

Then start the server:

```
cd my-graphql-server
yarn start
```

