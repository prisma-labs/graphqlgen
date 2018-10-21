import * as Ajv from 'ajv'
import * as chalk from 'chalk'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { DocumentNode, parse } from 'graphql'
import { importSchema } from 'graphql-import'

import { GraphQLGenDefinition, Language, Models } from 'graphqlgen-json-schema'
import schema = require('graphqlgen-json-schema/dist/schema.json')

import { ContextDefinition, ModelMap } from './types'
import {
  getAbsoluteFilePath,
  getImportPathRelativeToOutput,
} from './path-helpers'
import { getInterfaceNamesToPath } from './ast'
import { extractGraphQLTypesWithoutRootsAndInputs } from './source-helper'
import { normalizeFilePath } from './utils'

const ajv = new Ajv().addMetaSchema(
  require('ajv/lib/refs/json-schema-draft-06.json'),
)
const validateYaml = ajv.compile(schema)

export function parseConfig(): GraphQLGenDefinition {
  if (!fs.existsSync('graphqlgen.yml')) {
    console.error(chalk.default.red(`No graphqlgen.yml found`))
    process.exit(1)
  }

  const config = yaml.safeLoad(
    fs.readFileSync('graphqlgen.yml', 'utf-8'),
  ) as GraphQLGenDefinition

  if (!validateYaml(config)) {
    console.error(chalk.default.red(`Invalid graphqlgen.yml file`))
    console.error(chalk.default.red(printErrors(validateYaml.errors!)))
    process.exit(1)
  }

  return config
}

function printErrors(errors: any[]): string {
  return errors
    .map(e => {
      const params = Object.keys(e.params)
        .map(key => `${key}: ${e.params[key]}`)
        .join(', ')
      return `${e.dataPath} ${e.message}. ${params}`
    })
    .join('\n')
}

export function parseContext(
  context: string | undefined,
  outputDir: string,
): ContextDefinition | undefined {
  if (!context) {
    return undefined
  }

  const [filePath, interfaceName] = context.split(':')

  return {
    contextPath: getImportPathRelativeToOutput(filePath, outputDir),
    interfaceName,
  }
}

export function parseSchema(schemaPath: string): DocumentNode {
  if (!fs.existsSync(schemaPath)) {
    console.error(
      chalk.default.red(`The schema file ${schemaPath} does not exist`),
    )
    process.exit(1)
  }

  let schema = undefined
  try {
    schema = importSchema(schemaPath)
  } catch (e) {
    console.error(
      chalk.default.red(`Error occurred while reading schema: ${e}`),
    )
    process.exit(1)
  }

  let parsedSchema = undefined

  try {
    parsedSchema = parse(schema!)
  } catch (e) {
    console.error(chalk.default.red(`Failed to parse schema: ${e}`))
    process.exit(1)
  }

  return parsedSchema!
}

function buildModel(
  filePath: string,
  modelName: string,
  outputDir: string,
  language: Language,
) {
  const absoluteFilePath = getAbsoluteFilePath(filePath, language)
  const importPathRelativeToOutput = getImportPathRelativeToOutput(
    absoluteFilePath,
    outputDir,
  )
  return {
    absoluteFilePath,
    importPathRelativeToOutput,
    modelTypeName: modelName,
  }
}

export function parseModels(
  models: Models,
  schema: DocumentNode,
  outputDir: string,
  language: Language,
): ModelMap {
  const graphQLTypes = extractGraphQLTypesWithoutRootsAndInputs(schema)
  const filePaths = !!models.files
    ? models.files.map(file => normalizeFilePath(file, language))
    : []
  const overriddenModels = !!models.override ? models.override : {}
  const interfaceNamesToPath = getInterfaceNamesToPath(filePaths)

  return graphQLTypes.reduce((acc, type) => {
    if (overriddenModels[type.name]) {
      const [filePath, modelName] = models.override![type.name].split(':')

      return {
        ...acc,
        [type.name]: buildModel(filePath, modelName, outputDir, language),
      }
    }

    return {
      ...acc,
      [type.name]: buildModel(
        interfaceNamesToPath[type.name],
        type.name,
        outputDir,
        language,
      ),
    }
  }, {})
}
