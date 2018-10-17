import { generateCode } from '../../'
import * as fs from 'fs'
import { parse } from 'graphql'
import { join } from 'path'

test('large schema', async () => {
  const schema = fs.readFileSync(
    join(__dirname, '../fixtures/schema.graphql'),
    'utf-8',
  )
  const parsedSchema = parse(schema)
  const code = generateCode({ schema: parsedSchema })
  expect(code).toMatchSnapshot()
})
