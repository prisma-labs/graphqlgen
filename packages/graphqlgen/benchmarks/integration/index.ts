/**
 * This module contains utility functions for creating
 * integration benchmark instances.
 */

import * as Parse from '../../src/parse'
import * as ConfigTypes from 'graphqlgen-json-schema'
import * as Validation from '../../src/validation'
import * as GGen from '../../src'
import * as Bench from 'benchmark'
import * as Path from 'path'
import * as Sys from '../lib/sys'

type Options = {
  language: ConfigTypes.GraphQLGenDefinition['language']
  rootPath: string
  name: string
}

/**
 * Create a benchmark instance for testing the performance
 * of the whole GraphqlGen pipeline (except for initial
 * config parsing, file loading, and model map creation).
 */
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

/**
 * Create a configuration ready for consumption  by the
 * main code gen function. This utility function is needed
 * because of the current complexity of assembling the config.
 */
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

const validateFixtures = (scenarioFolder: string): void => {
  const name = Path.basename(scenarioFolder)
  const files = Sys.glob(Path.join(scenarioFolder, './*')).map(path =>
    Path.basename(path),
  )

  // TODO throw a multi-error

  if (!files.includes('schema.graphql')) {
    throw new Error(`benchmark "${name}" missing file schema.graphql`)
  }

  if (!files.includes('models.ts')) {
    throw new Error(`benchmark "${name}" missing file models.ts`)
  }
}

export { validateFixtures, createCodeGenConfig as setup, createBenchmark }
