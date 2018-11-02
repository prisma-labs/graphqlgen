import { join } from 'path'
import { validateModels } from '../../validation'
import { parseSchema } from '../../parse'
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
            Post: relative('./mocks/overridenModel/model.ts:PostModel')
          }
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
            Post: relative('./mocks/overridenModel/model.ts:Post')
          }
        },
      },
      false,
    )
  })
})
