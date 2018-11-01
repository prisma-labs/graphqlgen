import { testGeneration } from '../generation'
import { join } from 'path'

const language = 'flow'
const relative = (p: string) => join(__dirname, p)

test('large schema', async () => {
  testGeneration({
    language,
    schema: relative('../fixtures/prisma/schema.graphql'),
    context: relative('../fixtures/prisma/flow-types.js:Context'),
    models: {
      files: [relative('../fixtures/prisma/flow-types.js')],
    },
    output: relative('./generated/prisma/graphqlgen.js'),
    ['resolver-scaffolding']: {
      output: relative('./tmp/prisma/'),
      layout: 'file-per-type',
    },
  })
})
