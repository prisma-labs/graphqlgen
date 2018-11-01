import { testGeneration } from '../generation'
import { join } from 'path'

const language = 'flow'
const relative = (p: string) => join(__dirname, p)

test('basic schema', async () => {
  testGeneration({
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
  })
})

test('basic enum', async () => {
  testGeneration({
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
  })
})

test('basic union', async () => {
  testGeneration({
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
  })
})

test('defaultName', async () => {
  testGeneration({
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
  })
})

test('basic scalar', async () => {
  testGeneration({
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
  })
})
