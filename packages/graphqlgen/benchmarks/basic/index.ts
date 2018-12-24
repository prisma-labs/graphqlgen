import * as GGen from '../../src'
import * as Parse from '../../src/parse'
import * as Validation from '../../src/validation'
import { GraphQLGenDefinition } from 'graphqlgen-json-schema'
import * as Sys from '../lib/sys'

const log = console.log

const language = 'typescript'
const sdlFilePath = Sys.toAbsolutePath('./schema.graphql')
const schema = Parse.parseSchema(sdlFilePath)
const models = {
  files: [Sys.toAbsolutePath('./models.ts')],
}

const config: GraphQLGenDefinition = {
  language,
  schema: sdlFilePath,
  output: Sys.toAbsolutePath('./'),
  models,
}

Validation.validateConfig(config, schema)

const modelMap = Parse.parseModels(
  models,
  schema,
  Sys.toAbsolutePath('./'),
  language,
)

const run = () => {
  const generated = GGen.generateCode({
    language: language,
    schema: schema,
    config: config,
    modelMap: modelMap,
  })
  log(generated)
}

export { run }
