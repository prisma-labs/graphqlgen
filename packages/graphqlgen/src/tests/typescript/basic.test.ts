import { testGeneration } from '../generation'
import { join } from 'path'

const language = 'typescript'
const relative = (p: string) => join(__dirname, p)

test('basic schema', async () => {
  testGeneration({
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
  })
})

test('basic enum', async () => {
  testGeneration({
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
  })
})

test('basic union', async () => {
  testGeneration({
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
  })
})

test('defaultName', async () => {
  testGeneration({
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
  })
})

test('basic scalar', async () => {
  testGeneration({
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
  })
})

test('basic input', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/input/schema.graphql'),
    context: relative('../fixtures/input/types.ts:Context'),
    models: {
      files: [relative('../fixtures/input/types.ts')],
    },
    output: relative('./generated/input/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/input/'),
      layout: 'file-per-type',
    },
  })
})
