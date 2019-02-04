import { join } from 'path'
import { validateModels } from '../../src/validation'
import { parseSchema } from '../../src/parse'
import { Models } from 'graphqlgen-json-schema'

interface TestConfig {
  schema: string
  models: Models
}

const relative = (p: string) => join(__dirname, p)
const language = 'typescript'

function testValidateModels(config: TestConfig, expectedResult: boolean) {
  const schema = parseSchema(config.schema)
  console.log = jest.fn()
  expect(validateModels(config.models, schema, language)).toBe(expectedResult)
  if (!expectedResult) {
    expect(console.log).toHaveBeenCalled()
  }
}

describe('test validateModels()', () => {
  test('missing models', () => {
    testValidateModels(
      {
        schema: relative('./mocks/missingModels/schema.graphql'),
        models: {
          files: [relative('./mocks/missingModels/index.ts')],
        },
      },
      false,
    )
  })

  test('invalid files', () => {
    testValidateModels(
      {
        schema: relative('./mocks/missingModels/schema.graphql'),
        models: {
          files: [relative('./mocks/missingModels/typesB.ts')],
        },
      },
      false,
    )
  })

  test('evaluate overriden model', () => {
    testValidateModels(
      {
        schema: relative('./mocks/overridenModel/schema.graphql'),
        models: {
          files: [relative('./mocks/overridenModel/types.ts')],
          override: {
            Post: relative('./mocks/overridenModel/model.ts:PostModel'),
          },
        },
      },
      true,
    )
  })

  test('invalid overriden models', () => {
    testValidateModels(
      {
        schema: relative('./mocks/overridenModel/schema.graphql'),
        models: {
          files: [relative('./mocks/overridenModel/types.ts')],
          override: {
            Post: relative('./mocks/overridenModel/model.ts:Post'),
          },
        },
      },
      false,
    )
  })

  test('import schema ts default', () => {
    testValidateModels(
      {
        schema: relative('./mocks/tsSchemaDefault/schema.ts'),
        models: {
          files: [relative('./mocks/tsSchemaDefault/types.ts')],
          override: {
            Post: relative('./mocks/tsSchemaDefault/model.ts:PostModel'),
          },
        },
      },
      true,
    )
  })

  test('import schema ts const', () => {
    testValidateModels(
      {
        schema: relative('./mocks/tsSchemaConst/schema.ts:typeDefs'),
        models: {
          files: [relative('./mocks/tsSchemaConst/types.ts')],
          override: {
            Post: relative('./mocks/tsSchemaConst/model.ts:PostModel'),
          },
        },
      },
      true,
    )
  })

  test('import schema gql default', () => {
    testValidateModels(
      {
        schema: relative('./mocks/gqlSchema/schema.ts:typeDefs'),
        models: {
          files: [relative('./mocks/gqlSchema/types.ts')],
          override: {
            Post: relative('./mocks/gqlSchema/model.ts:PostModel'),
          },
        },
      },
      true,
    )
  })
})
