import { GraphQLGenDefinition } from 'graphqlgen-json-schema'
import { join } from 'path'

import { generateCode } from '../../index'
import { validateConfig } from '../../validation'
import { parseSchema, parseModels } from '../../parse'

const relative = (p: string) => join(__dirname, p)

test('basic schema', async () => {
  const language = 'typescript'
  const config: GraphQLGenDefinition = {
    language,
    schema: relative('../fixtures/basic/schema.graphql'),
    context: relative('../fixtures/basic:Context'),
    models: {
      files: [relative('../fixtures/basic/index.ts')],
    },
    output: relative('./generated/basic/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/basic/'),
      layout: 'file-per-type',
    },
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

test('basic enum', async () => {
  const language = 'typescript'
  const config: GraphQLGenDefinition = {
    language,
    schema: relative('../fixtures/enum/schema.graphql'),
    context: relative('../fixtures/enum/types.ts:Context'),
    models: {
      files: [relative('../fixtures/enum/types.ts')],
    },
    output: relative('./generated/enum/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/enum/'),
      layout: 'file-per-type',
    },
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
  expect(validateConfig(config, schema)).toBe(true)
})

test('basic union', async () => {
  const language = 'typescript'
  const config: GraphQLGenDefinition = {
    language,
    schema: relative('../fixtures/union/schema.graphql'),
    context: relative('../fixtures/union/types.ts:Context'),
    models: {
      files: [relative('../fixtures/union/types.ts')],
    },
    output: relative('./generated/union/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/union/'),
      layout: 'file-per-type',
    },
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
  expect(validateConfig(config, schema)).toBe(true)
})

test('defaultName', async () => {
  const language = 'typescript'
  const config: GraphQLGenDefinition = {
    language,
    schema: relative('../fixtures/defaultName/schema.graphql'),
    context: relative('../fixtures/defaultName:Context'),
    models: {
      files: [
        {
          path: relative('../fixtures/defaultName/index.ts'),
          defaultName: '${typeName}Node',
        },
      ],
    },
    output: relative('./generated/defaultName/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/scalar/'),
      layout: 'file-per-type',
    },
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

  expect(validateConfig(config, schema)).toBe(true)
})

test('basic scalar', async () => {
  const language = 'typescript'
  const config: GraphQLGenDefinition = {
    language,
    schema: relative('../fixtures/scalar/schema.graphql'),
    context: relative('../fixtures/scalar/types.ts:Context'),
    models: {
      files: [relative('../fixtures/scalar/types.ts')],
    },
    output: relative('./generated/scalar/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/scalar/'),
      layout: 'file-per-type',
    },
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

  expect(validateConfig(config, schema)).toBe(true)
})
