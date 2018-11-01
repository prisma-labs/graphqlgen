import { testGeneration } from '../generation'
import { join } from 'path'

const language = 'typescript'
const relative = (p: string) => join(__dirname, p)

describe('large schema tests', () => {
  test('large schema', async () => {
    testGeneration({
      language,
      schema: relative('../fixtures/prisma/schema.graphql'),
      context: relative('../fixtures/prisma/types.ts:Context'),
      models: {
        files: [relative('../fixtures/prisma/types.ts')],
      },
      output: relative('./generated/prisma/graphqlgen.ts'),
      ['resolver-scaffolding']: {
        output: relative('./tmp/prisma/'),
        layout: 'file-per-type',
      },
    })
  })
})
