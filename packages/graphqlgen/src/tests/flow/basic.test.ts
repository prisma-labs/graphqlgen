import { GraphQLGenDefinition } from 'graphqlgen-json-schema'
import { join } from 'path'

import { generateCode } from '../../index'
import { validateConfig } from '../../validation'
import { parseSchema, parseModels } from '../../parse'

const relative = (p: string) => join(__dirname, p)
const language = 'flow'

test('basic schema', async () => {
  const config: GraphQLGenDefinition = {
    language,
    schema: relative('../fixtures/basic/schema.graphql'),
    context: relative('../fixtures/basic/types-flow.js:Context'),
    models: {
      files: [relative('../fixtures/basic/types-flow.js')],
    },
    output: relative('./generated/basic/graphqlgen.js'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/basic/'),
      layout: 'file-per-type',
    },
  }
  const schema = parseSchema(config.schema)

  expect(validateConfig(config, schema)).toBe(true)

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
  const config: GraphQLGenDefinition = {
    language,
    schema: relative('../fixtures/enum/schema.graphql'),
    context: relative('../fixtures/enum/types-flow.js:Context'),
    models: {
      files: [relative('../fixtures/enum/types-flow.js')],
    },
    output: relative('./generated/enum/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/enum/'),
      layout: 'file-per-type',
    },
  }
  const schema = parseSchema(config.schema)

  expect(validateConfig(config, schema)).toBe(true)

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

test('basic union', async () => {
  const config: GraphQLGenDefinition = {
    language,
    schema: relative('../fixtures/union/schema.graphql'),
    context: relative('../fixtures/union/flow-types.js:Context'),
    models: {
      files: [relative('../fixtures/union/flow-types.js')],
    },
    output: relative('./generated/union/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/union/'),
      layout: 'file-per-type',
    },
  }
  const schema = parseSchema(config.schema)

  expect(validateConfig(config, schema)).toBe(true)

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

test('defaultName', async () => {
  const config: GraphQLGenDefinition = {
    language,
    schema: relative('../fixtures/defaultName/schema.graphql'),
    context: relative('../fixtures/defaultName/flow-types.js:Context'),
    models: {
      files: [
        {
          path: relative('../fixtures/defaultName/flow-types.js'),
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

  expect(validateConfig(config, schema)).toBe(true)

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

test('basic scalar', async () => {
  const config: GraphQLGenDefinition = {
    language,
    schema: relative('../fixtures/scalar/schema.graphql'),
    context: relative('../fixtures/scalar/flow-types.js:Context'),
    models: {
      files: [relative('../fixtures/scalar/flow-types.js')],
    },
    output: relative('./generated/scalar/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/scalar/'),
      layout: 'file-per-type',
    },
  }
  const schema = parseSchema(config.schema)

  expect(validateConfig(config, schema)).toBe(true)

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
