import * as Ajv from 'ajv'
import * as chalk from 'chalk'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { importSchema } from 'graphql-import'

import {
  GraphQLGenDefinition,
  Language,
  Models,
  File,
} from 'graphqlgen-json-schema'
import schema = require('graphqlgen-json-schema/dist/schema.json')

import { ContextDefinition, ModelMap } from './types'
import {
  getAbsoluteFilePath,
  getImportPathRelativeToOutput,
} from './path-helpers'
import { getTypeToFileMapping, replaceAll, normalizeFilePath } from './utils'
import { extractTypes, extractGraphQLTypesWithoutRootsAndInputs, GraphQLTypes } from './source-helper'

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

export function parseSchema(schemaPath: string): GraphQLTypes {
  if (!fs.existsSync(schemaPath)) {
    console.error(
      chalk.default.red(`The schema file ${schemaPath} does not exist`),
    )
    process.exit(1)
  }

  let schema: string | undefined
  try {
    schema = importSchema(schemaPath)
  } catch (e) {
    console.error(
      chalk.default.red(`Error occurred while reading schema: ${e}`),
    )
    process.exit(1)
  }

  let types: GraphQLTypes
  try {
    types = extractTypes(schema!)
  } catch (e) {
    console.error(chalk.default.red(`Failed to parse schema: ${e}`))
    process.exit(1)
  }

  return types!
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

export function getPath(file: File): string {
  if (typeof file === 'string') {
    return file
  }

  return file.path
}

export function getDefaultName(file: File): string | null {
  if (typeof file === 'string') {
    return null
  }

  return file.defaultName || null
}

export function parseModels(
  models: Models,
  schema: GraphQLTypes,
  outputDir: string,
  language: Language,
): ModelMap {
  const graphQLTypes = extractGraphQLTypesWithoutRootsAndInputs(schema)
  const filePaths = !!models.files
    ? models.files.map(file => ({
        defaultName: typeof file === 'object' ? file.defaultName : undefined,
        path: normalizeFilePath(getPath(file), language),
      }))
    : []
  const overriddenModels = !!models.override ? models.override : {}
  const typeToFileMapping = getTypeToFileMapping(filePaths, language)

  return graphQLTypes.reduce((acc, type) => {
    if (overriddenModels[type.name]) {
      const [filePath, modelName] = models.override![type.name].split(':')

      return {
        ...acc,
        [type.name]: buildModel(filePath, modelName, outputDir, language),
      }
    }

    const typeFileTuple = Object.entries(typeToFileMapping).find(
      ([typeName, file]) => {
        const defaultName = getDefaultName(file)
        const replacedTypeName = defaultName
          ? replaceVariablesInString(defaultName, { typeName: type.name })
          : type.name

        return typeName === replacedTypeName
      },
    )

    if (!typeFileTuple) {
      throw new Error(
        `Could not find type ${type.name} in any of the provided files`,
      )
    }

    const file = typeFileTuple[1]

    const filePath = getPath(file)
    const defaultName = getDefaultName(file)

    const replacedTypeName = defaultName
      ? replaceVariablesInString(defaultName, { typeName: type.name })
      : type.name

    return {
      ...acc,
      [type.name]: buildModel(filePath, replacedTypeName, outputDir, language),
    }
  }, {})
}

interface ReplacementMap {
  [key: string]: string
}

export function replaceVariablesInString(
  str: string,
  replacements: ReplacementMap,
) {
  const variableSyntax = RegExp(
    '\\${([ ~:a-zA-Z0-9._\'",\\-\\/\\(\\)]+?)}',
    'g',
  )
  let newStr = str
  if (variableSyntax.test(str)) {
    str.match(variableSyntax)!.forEach(matchedString => {
      // strip ${} away to get the pure variable name
      const variableName = matchedString
        .replace(variableSyntax, (_, varName) => varName.trim())
        .replace(/\s/g, '')

      if (replacements[variableName]) {
        newStr = replaceAll(newStr, matchedString, replacements[variableName])
      } else {
        throw new Error(`Variable ${variableName} is not covered by a value`)
      }
    })
  }

  return newStr
}
