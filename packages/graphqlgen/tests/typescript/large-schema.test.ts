import { testGeneration } from '../generation'
import { join } from 'path'

const relative = (p: string) => join(__dirname, p)

const typesDir = relative('./generated-large/graphqlgen.ts')
const resolversDir = relative('./generated-large/tmp-resolvers/')
const language = 'typescript'

describe('large schema tests', () => {
  test('large schema', async () => {
    return testGeneration({
      language,
      schema: relative('../fixtures/prisma/schema.graphql'),
      models: {
        files: [relative('../fixtures/prisma/types.ts')],
      },
      output: typesDir,
      ['resolver-scaffolding']: {
        output: resolversDir,
        layout: 'file-per-type',
      },
    })
  })
})
