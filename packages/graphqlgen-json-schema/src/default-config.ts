import { GraphQLGenDefinition } from './definition'

const getRootFolder = (file: string) => {
  return `./src/graphql/${file}`
}

const getOutputFolder = (file: string) => {
  return `./src/graphql/generated/${file}`
}

export const defaultConfig: GraphQLGenDefinition = {
  language: 'typescript',
  schema: getRootFolder('schema/**.graphql'),
  context: getRootFolder('context.ts:Context'),
  models: {
    files: [getRootFolder('models/**.ts')],
  },
  output: getOutputFolder('graphqlgen.ts'),
  'schema-output': getOutputFolder('graphqlgen.schema.graphql'),
  'resolver-scaffolding': {
    layout: 'file-per-type',
    output: getOutputFolder('tmp-resolvers'),
  },
}
