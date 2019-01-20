import { testGeneration } from '../generation'
import { join } from 'path'

const relative = (p: string) => join(__dirname, p)

const typesPath = relative('./generated-basic/graphqlgen.ts')
const resolversDir = relative('./generated-basic/tmp-resolvers/')
const language = 'typescript'

test('basic schema', async () => {
  return testGeneration({
    language,
    schema: relative('../fixtures/basic/schema.graphql'),
    models: {
      files: [relative('../fixtures/basic/index.ts')],
    },
    output: typesPath,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('basic enum', async () => {
  return testGeneration({
    language,
    schema: relative('../fixtures/enum/schema.graphql'),
    models: {
      files: [relative('../fixtures/enum/types.ts')],
    },
    output: typesPath,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('basic union', async () => {
  return testGeneration({
    language,
    schema: relative('../fixtures/union/schema.graphql'),
    models: {
      files: [relative('../fixtures/union/types.ts')],
    },
    output: typesPath,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('defaultName', async () => {
  return testGeneration({
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
    output: typesPath,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('basic scalar', async () => {
  return testGeneration({
    language,
    schema: relative('../fixtures/scalar/schema.graphql'),
    models: {
      files: [relative('../fixtures/scalar/types.ts')],
    },
    output: typesPath,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('basic input', async () => {
  return testGeneration({
    language,
    schema: relative('../fixtures/input/schema.graphql'),
    models: {
      files: [relative('../fixtures/input/types.ts')],
    },
    output: typesPath,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('context', async () => {
  return testGeneration({
    language,
    schema: relative('../fixtures/context/schema.graphql'),
    context: relative('../fixtures/context/types.ts:Context'),
    models: {
      files: [relative('../fixtures/context/types.ts')],
    },
    output: typesPath,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('subscription', () => {
  return testGeneration({
    language,
    schema: relative('../fixtures/subscription/schema.graphql'),
    models: {
      files: [relative('../fixtures/subscription/types.ts')],
    },
    output: typesPath,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})

test('override model', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/basic/schema.graphql'),
    models: {
      override: {
        Number: `${relative('../fixtures/basic')}:Number`,
      },
    },
    output: relative('./generated/basic/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/basic/'),
      layout: 'file-per-type',
    },
  })
})

test('override model same names', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/override/schema.graphql'),
    models: {
      files: [relative('../fixtures/override/types.ts')],
      override: {
        Foo: `${relative('../fixtures/override/override-1.ts')}:Foo`,
        Bar: `${relative('../fixtures/override/override-2.ts')}:Foo`,
      },
    },
    output: relative('./generated/override/graphqlgen.ts'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/override/'),
      layout: 'file-per-type',
    },
  })
})
