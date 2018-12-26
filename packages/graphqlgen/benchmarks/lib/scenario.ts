import * as Sys from './sys'
import * as Parse from '../../src/parse'
import * as ConfigTypes from 'graphqlgen-json-schema'
import * as Validation from '../../src/validation'
import * as GGen from '../../src'
import * as Bench from 'benchmark'

type Options = {
  language: ConfigTypes.GraphQLGenDefinition['language']
}

const createBenchmark = (config: Options): Bench => {
  const codeGenConfig = createCodeGenConfig({
    language: config.language,
    rootPath: Sys.toAbsolutePathRelativeToCaller('.'),
  })
  const benchmark = new Bench({
    name: 'complex',
    fn: () => {
      GGen.generateCode(codeGenConfig)
    },
  })
  return benchmark
}

type CodeGenConfigOptions = {
  language: ConfigTypes.GraphQLGenDefinition['language']
  rootPath: string
}

const createCodeGenConfig = (
  config: CodeGenConfigOptions,
): GGen.GenerateCodeArgs => {
  const sdlFilePath = Sys.path(config.rootPath, 'schema.graphql')

  const schema = Parse.parseSchema(sdlFilePath)

  const models = {
    files: [Sys.path(config.rootPath, './models.ts')],
  }

  const graphqlGenConfig: ConfigTypes.GraphQLGenDefinition = {
    language: config.language,
    schema: sdlFilePath,
    output: Sys.path(config.rootPath, './'),
    models,
  }

  // Needed to initialize singleton data in Parse module
  Validation.validateConfig(graphqlGenConfig, schema)

  const modelMap = Parse.parseModels(
    models,
    schema,
    Sys.path(config.rootPath, './'),
    graphqlGenConfig.language,
  )

  return {
    language: graphqlGenConfig.language,
    schema,
    config: graphqlGenConfig,
    modelMap,
  }
}

export { createCodeGenConfig as setup, createBenchmark }
