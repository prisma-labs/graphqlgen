import { GraphQLGenDefinition } from './definition'

export const createConfig = (
  rootDir: string = './src/graphql',
  outputFolder: string = '__generated__',
) => {
  const getRootFolder = (file: string) => {
    return `${rootDir}/${file}`
  }

  const getOutputFolder = (file: string) => {
    return `${rootDir}/${outputFolder}/${file}`
  }

  const defaultConfig: GraphQLGenDefinition = {
    language: 'typescript',
    schema: getRootFolder('schemas/**/*.graphql'),
    context: getRootFolder('models/context.ts:Context'),
    models: {
      files: [getRootFolder('models/**/*.ts')],
    },
    output: getOutputFolder('graphqlgen.ts'),
    'schema-output': getOutputFolder('schema.graphql'),
    'resolver-scaffolding': {
      layout: 'file-per-type',
      output: getOutputFolder('tmp-resolvers'),
    },
  }

  return defaultConfig
}

export const defaultConfig: GraphQLGenDefinition = createConfig()
