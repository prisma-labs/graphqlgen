import * as Ajv from 'ajv'
import * as yaml from 'js-yaml'
import schema = require('../schema.json')
import * as fs from 'fs'
import * as path from 'path'

const ajv = new Ajv().addMetaSchema(
  require('ajv/lib/refs/json-schema-draft-06.json'),
)
const validateYaml = ajv.compile(schema)

export function parseConfig(file: string) {
  const config = yaml.safeLoad(file)

  if (!validateYaml(config)) {
    throw new Error(JSON.stringify(validateYaml.errors!, null, 2))
  }

  return config
}

test('basic config', () => {
  const file = fs.readFileSync(
    path.join(__dirname, 'fixtures/basic.yml'),
    'utf-8',
  )
  expect(parseConfig(file)).toMatchSnapshot()
})
