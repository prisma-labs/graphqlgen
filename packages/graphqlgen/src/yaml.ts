import * as Ajv from 'ajv'
import * as chalk from 'chalk'
import * as fs from 'fs'
import * as yaml from 'js-yaml'

import { GraphQLGenDefinition } from 'graphqlgen-json-schema'

import schema = require('graphqlgen-json-schema/dist/schema.json')

const ajv = new Ajv().addMetaSchema(
  require('ajv/lib/refs/json-schema-draft-06.json'),
)
const validateYaml = ajv.compile(schema)

export function parseConfig() {
  if (!fs.existsSync('graphqlgen.yml')) {
    console.error(chalk.default.red(`No graphqlgen.yml found`))
    process.exit(1)
  }

  const config = yaml.safeLoad(
    fs.readFileSync('graphqlgen.yml', 'utf-8'),
  ) as GraphQLGenDefinition

  //TODO: Provide better errors
  if (!validateYaml(config)) {
    console.error(chalk.default.red(`Invalid graphqlgen.yml file`))
    process.exit(1)
  }

  return config
}
