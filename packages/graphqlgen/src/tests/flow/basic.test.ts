import { testGeneration } from '../generation'
import { join } from 'path'

const relative = (p: string) => join(__dirname, p)
const typesPath = relative('./generated-basic/graphqlgen.js')
const resolversDir = relative('./generated-basic/tmp-resolvers/')
const language = 'flow'

test('basic schema', async () => {
  return testGeneration({
    language,
    schema: relative('../fixtures/basic/schema.graphql'),
    models: {
      files: [relative('../fixtures/basic/types-flow.js')],
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
      files: [relative('../fixtures/enum/types-flow.js')],
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
      files: [relative('../fixtures/union/flow-types.js')],
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
          path: relative('../fixtures/defaultName/flow-types.js'),
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

// // TODO: Fix this test (detected since compiling flow)
// test('basic scalar', async () => {
//   return testGeneration({
//     language,
//     schema: relative('../fixtures/scalar/schema.graphql'),
//     models: {
//       files: [relative('../fixtures/scalar/flow-types.js')],
//     },
//     output: typesPath,
//     ['resolver-scaffolding']: {
//       output: resolversDir,
//       layout: 'file-per-type',
//     },
//   })
// })

test('context', async () => {
  return testGeneration({
    language,
    schema: relative('../fixtures/context/schema.graphql'),
    context: relative('../fixtures/context/flow-types.js:Context'),
    models: {
      files: [relative('../fixtures/context/flow-types.js')],
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
      files: [relative('../fixtures/subscription/flow-types.js')],
    },
    output: typesPath,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})
