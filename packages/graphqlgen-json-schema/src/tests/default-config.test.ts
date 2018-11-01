import { defaultConfig } from '../default-config'
import { GraphQLGenDefinition } from '../definition'

const customDefaultConfig: GraphQLGenDefinition = {
  language: 'typescript',
  schema: './src/graphql/schema/**.graphql',
  context: './src/graphql/context.ts:Context',
  models: {
    files: ['./src/graphql/resolvers/**.ts'],
  },
  output: './src/graphql/generated/graphqlgen.ts',
  'resolver-scaffolding': {
    layout: 'file-per-type',
    output: './src/graphql/generated/tmp-resolvers',
  },
}

test('Default config', () => {
  expect(defaultConfig).toMatchObject(customDefaultConfig)
})
