import { testGeneration } from '../generation'
import { join } from 'path'

const relative = (p: string) => join(__dirname, p)

const typesDir = relative('./generated-basic/graphqlgen.ts')
const resolversDir = relative('./generated-basic/tmp-resolvers/')
const language = 'typescript'

test('basic schema', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/basic/schema.graphql'),
    models: {
      files: [relative('../fixtures/basic/index.ts')],
    },
    output: typesDir,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('basic enum', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/enum/schema.graphql'),
    models: {
      files: [relative('../fixtures/enum/types.ts')],
    },
    output: typesDir,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('basic union', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/union/schema.graphql'),
    models: {
      files: [relative('../fixtures/union/types.ts')],
    },
    output: typesDir,
    ['resolver-scaffolding']: {
      output: resolversDir,
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
          path: relative('../fixtures/defaultName/index.ts'),
          defaultName: '${typeName}Node',
        },
      ],
    },
    output: typesDir,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('basic scalar', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/scalar/schema.graphql'),
    models: {
      files: [relative('../fixtures/scalar/types.ts')],
    },
    output: typesDir,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('basic input', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/input/schema.graphql'),
    models: {
      files: [relative('../fixtures/input/types.ts')],
    },
    output: typesDir,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('context', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/context/schema.graphql'),
    context: relative('../fixtures/context/types.ts:Context'),
    models: {
      files: [relative('../fixtures/context/types.ts')],
    },
    output: typesDir,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('subscription', () => {
  testGeneration({
    language,
    schema: relative('../fixtures/subscription/schema.graphql'),
    models: {
      files: [relative('../fixtures/subscription/types.ts')],
    },
    output: typesDir,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})
