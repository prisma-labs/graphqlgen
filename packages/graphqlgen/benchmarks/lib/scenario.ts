import * as Parse from '../../src/parse'
import * as ConfigTypes from 'graphqlgen-json-schema'
import * as Validation from '../../src/validation'
import * as GGen from '../../src'
import * as Bench from 'benchmark'
import * as Path from 'path'

type Options = {
  language: ConfigTypes.GraphQLGenDefinition['language']
  rootPath: string
  name: string
}

const createBenchmark = (config: Options): Bench => {
  const codeGenConfig = createCodeGenConfig({
    language: config.language,
    rootPath: config.rootPath,
  })
  const benchmark = new Bench({
    name: config.name,
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
  const sdlFilePath = Path.join(config.rootPath, 'schema.graphql')

  const schema = Parse.parseSchema(sdlFilePath)

  const models = {
    files: [Path.join(config.rootPath, './models.ts')],
  }

  const graphqlGenConfig: ConfigTypes.GraphQLGenDefinition = {
    language: config.language,
    schema: sdlFilePath,
    output: Path.join(config.rootPath, './'),
    models,
  }

  // Needed to initialize singleton data in Parse module
  Validation.validateConfig(graphqlGenConfig, schema)

  const modelMap = Parse.parseModels(
    models,
    schema,
    Path.join(config.rootPath, './'),
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
