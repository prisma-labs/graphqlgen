import { createConfig } from 'graphqlgen-json-schema/dist/default-config'
import { readSchemaSync, generateSchema } from '../../concat-schema'

const config = createConfig('./src/tests/fixtures/advanced-scaffold')

test('create config', async () => {
  expect(config).toMatchSnapshot()
})

test('Read Schema', () => {
  expect(readSchemaSync(config.schema)).toMatchSnapshot()
})

test('Generate Schema', () => {
  expect(generateSchema(config)).toBeTruthy()
})
