import { generateCode, buildModelMap, parseSchema } from '../../'
import { join } from 'path'
import { GraphQLGenDefinition } from 'graphqlgen-json-schema'

const relative = (p: string) => join(__dirname, p)

test('basic schema', async () => {
  const config: GraphQLGenDefinition = {
    language: 'typescript',
    schema: relative('../fixtures/basic/schema.graphql'),
    context: relative('../fixtures/basic:Context'),
    models: {
      Number: relative('../fixtures/basic/index.ts:Number'),
    },
    output: relative('./generated/basic/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/basic/'),
      layout: 'file-per-type',
    },
  }
  const schema = parseSchema(config.schema)
  const modelMap = buildModelMap(config.models, config.output)
  const { generatedTypes, generatedResolvers } = generateCode({
    schema,
    language: 'typescript',
    config,
    modelMap,
    prettify: true,
  })
  expect(generatedTypes).toMatchSnapshot()
  expect(generatedResolvers).toMatchSnapshot()
})

test('basic enum', async () => {
  const config: GraphQLGenDefinition = {
    language: 'typescript',
    schema: relative('../fixtures/enum/schema.graphql'),
    context: relative('../fixtures/enum/types.ts:Context'),
    models: {
      Number: relative('../fixtures/enum/types.ts:Number'),
    },
    output: relative('./generated/enum/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/enum/'),
      layout: 'file-per-type',
    },
  }
  const schema = parseSchema(config.schema)
  const modelMap = buildModelMap(config.models, config.output)
  const { generatedTypes, generatedResolvers } = generateCode({
    schema,
    language: 'typescript',
    config,
    modelMap,
    prettify: true,
  })
  expect(generatedTypes).toMatchSnapshot()
  expect(generatedResolvers).toMatchSnapshot()
})

test('basic union', async () => {
  const config: GraphQLGenDefinition = {
    language: 'typescript',
    schema: relative('../fixtures/union/schema.graphql'),
    context: relative('../fixtures/union/types.ts:Context'),
    models: {
      Number: relative('../fixtures/union/types.ts:Number'),
    },
    output: relative('./generated/union/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/union/'),
      layout: 'file-per-type',
    },
  }
  const schema = parseSchema(config.schema)
  const modelMap = buildModelMap(config.models, config.output)
  const { generatedTypes, generatedResolvers } = generateCode({
    schema,
    language: 'typescript',
    config,
    modelMap,
    prettify: true,
  })
  expect(generatedTypes).toMatchSnapshot()
  expect(generatedResolvers).toMatchSnapshot()
})

test('basic scalar', async () => {
  const config: GraphQLGenDefinition = {
    language: 'typescript',
    schema: relative('../fixtures/scalar/schema.graphql'),
    context: relative('../fixtures/scalar/types.ts:Context'),
    models: {
      Number: relative('../fixtures/scalar/types.ts:Number'),
    },
    output: relative('./generated/scalar/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/scalar/'),
      layout: 'file-per-type',
    },
  }
  const schema = parseSchema(config.schema)
  const modelMap = buildModelMap(config.models, config.output)
  const { generatedTypes, generatedResolvers } = generateCode({
    schema,
    language: 'typescript',
    config,
    modelMap,
    prettify: true,
  })
  expect(generatedTypes).toMatchSnapshot()
  expect(generatedResolvers).toMatchSnapshot()
})
