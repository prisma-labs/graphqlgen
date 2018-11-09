import { testGeneration } from '../generation'
import { join } from 'path'

const language = 'flow'
const relative = (p: string) => join(__dirname, p)

test('basic schema', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/basic/schema.graphql'),
    models: {
      files: [relative('../fixtures/basic/types-flow.js')],
    },
    output: relative('./generated/basic/graphqlgen.js'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/basic/'),
      layout: 'file-per-type',
    },
  })
})

test('basic enum', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/enum/schema.graphql'),
    models: {
      files: [relative('../fixtures/enum/types-flow.js')],
    },
    output: relative('./generated/enum/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/enum/'),
      layout: 'file-per-type',
    },
  })
})

test('basic union', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/union/schema.graphql'),
    models: {
      files: [relative('../fixtures/union/flow-types.js')],
    },
    output: relative('./generated/union/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/union/'),
      layout: 'file-per-type',
    },
  })
})

test('defaultName', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/defaultName/schema.graphql'),
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
  })
})

test('basic scalar', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/scalar/schema.graphql'),
    models: {
      files: [relative('../fixtures/scalar/flow-types.js')],
    },
    output: relative('./generated/scalar/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/scalar/'),
      layout: 'file-per-type',
    },
  })
})

test('context', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/context/schema.graphql'),
    context: relative('../fixtures/context/flow-types.js:Context'),
    models: {
      files: [relative('../fixtures/context/flow-types.js')],
    },
    output: relative('./generated/context/graphqlgen.js'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/input/'),
      layout: 'file-per-type',
    },
  })
})

test('subscription', () => {
  testGeneration({
    language,
    schema: relative('../fixtures/subscription/schema.graphql'),
    models: {
      files: [relative('../fixtures/subscription/flow-types.js')],
    },
    output: relative('./generated/subscription/graphqlgen.js'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/input/'),
      layout: 'file-per-type',
    },
  })
})
