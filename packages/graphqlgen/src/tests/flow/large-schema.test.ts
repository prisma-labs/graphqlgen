import { testGeneration } from '../generation'
import { join } from 'path'

const relative = (p: string) => join(__dirname, p)
const typesDir = relative('./generated-large/graphqlgen.js')
const resolversDir = relative('./generated-large/tmp-resolvers/')
const language = 'flow'

test('large schema', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/prisma/schema.graphql'),
    models: {
      files: [relative('../fixtures/prisma/flow-types.js')],
    },
    output: typesDir,
    ['resolver-scaffolding']: {
      output: resolversDir,
      layout: 'file-per-type',
    },
  })
})
