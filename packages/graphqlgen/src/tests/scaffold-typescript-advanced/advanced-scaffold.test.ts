import {
  createConfig,
  defaultConfig,
} from 'graphqlgen-json-schema/dist/default-config'
import { readSchemaSync, generateSchema } from '../../concat-schema'
import { parseSchema, parseModels } from '../../parse'
import { generateCode } from '../..'
import { extractGlobPattern, handleGlobPattern } from '../../glob'

const config = createConfig('./src/tests/fixtures/advanced-scaffold')

test('default config', async () => {
  expect(defaultConfig).toMatchSnapshot()
})

test('create config', async () => {
  expect(config).toMatchSnapshot()
})

test('Check Schemas', () => {
  expect(extractGlobPattern([config.schema])).toMatchSnapshot()
})

test('Check Models', () => {
  expect(extractGlobPattern(config.models.files as any)).toMatchSnapshot()
})

test('Read Schema', () => {
  expect(readSchemaSync(config.schema)).toMatchSnapshot()
})

test('Generate Schema', () => {
  expect(generateSchema(config)).toBeTruthy()
})

test('Advance scaffolding', () => {
  const language = config.language

  generateSchema(config)
  config.schema = config['schema-output']

  // Override the config.models.files using handleGlobPattern
  config.models = {
    ...config.models,
    files: handleGlobPattern(config.models.files),
  }

  const schema = parseSchema(config.schema)

  const modelMap = parseModels(config.models, schema, config.output, language)
  const { generatedTypes, generatedResolvers } = generateCode({
    schema,
    language,
    config,
    modelMap,
    prettify: true,
  })
  expect(generatedTypes).toMatchSnapshot()
  expect(generatedResolvers).toMatchSnapshot()
})
