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
    files: [getRootFolder('resolvers/**.ts')],
  },
  output: getOutputFolder('graphqlgen.ts'),
  'resolver-scaffolding': {
    layout: 'file-per-type',
    output: getOutputFolder('tmp-resolvers'),
  },
}
