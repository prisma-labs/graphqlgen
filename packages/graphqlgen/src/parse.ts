import * as Ajv from 'ajv'
import * as chalk from 'chalk'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as Path from 'path'
import * as tsNode from 'ts-node'
import { print } from 'graphql'
import { importSchema } from 'graphql-import'
import {
  GraphQLGenDefinition,
  Language,
  Models,
  File,
} from 'graphqlgen-json-schema'
import schema = require('graphqlgen-json-schema/dist/schema.json')

import { ContextDefinition, ModelMap, Model } from './types'
import {
  getAbsoluteFilePath,
  getImportPathRelativeToOutput,
} from './path-helpers'
import { getTypeToFileMapping, replaceAll, normalizeFilePath } from './utils'
import {
  extractTypes,
  extractGraphQLTypesWithoutRootsAndInputsAndEnums,
  GraphQLTypes,
} from './source-helper'
import { FilesToTypesMap } from './introspection/types'
import { getFilesToTypesMap } from './introspection'

export interface NormalizedFile {
  path: string
  defaultName?: string
}

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
  const [filePath, exportName = 'default'] = schemaPath.split(':')

  // We can assume absolute path is cwd prefixed because
  // gg currently only works when run in a directory with the
  // graphqlgen manifest.
  const absoluteFilePath =
    filePath[0] == '/' ? filePath : Path.join(process.cwd(), filePath)

  if (!fs.existsSync(absoluteFilePath)) {
    console.error(
      chalk.default.red(`The schema file ${filePath} does not exist`),
    )
    process.exit(1)
  }

  let schema: string | undefined
  try {
    if (filePath.endsWith('.ts')) {
      tsNode.register({
        transpileOnly: true,
      })
      const schemaModule = require(absoluteFilePath)
      const loadedSchema = schemaModule[exportName]

      if (typeof loadedSchema === 'string') {
        schema = loadedSchema
      } else {
        schema = print(loadedSchema)
      }
    } else {
      schema = importSchema(filePath)
    }
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
  modelName: string,
  filePath: string,
  filesToTypesMap: FilesToTypesMap,
  outputDir: string,
  language: Language,
): Model {
  const absoluteFilePath = getAbsoluteFilePath(filePath, language)
  const importPathRelativeToOutput = getImportPathRelativeToOutput(
    absoluteFilePath,
    outputDir,
  )
  return {
    absoluteFilePath,
    importPathRelativeToOutput,
    definition: filesToTypesMap[filePath][modelName],
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

export function normalizeFiles(
  files: File[] | undefined,
  language: Language,
): NormalizedFile[] {
  return files !== undefined
    ? files.map(file => ({
        defaultName: typeof file === 'object' ? file.defaultName : undefined,
        path: normalizeFilePath(getPath(file), language),
      }))
    : []
}

export function parseModels(
  models: Models,
  schema: GraphQLTypes,
  outputDir: string,
  language: Language,
): ModelMap {
  const graphQLTypes = extractGraphQLTypesWithoutRootsAndInputsAndEnums(schema)
  const normalizedFiles = normalizeFiles(models.files, language)
  const filesToTypesMap = getFilesToTypesMap()
  const overriddenModels = !!models.override ? models.override : {}
  const typeToFileMapping = getTypeToFileMapping(
    normalizedFiles,
    filesToTypesMap,
  )

  return graphQLTypes.reduce((acc, type) => {
    if (overriddenModels[type.name]) {
      const [filePath, modelName] = models.override![type.name].split(':')

      return {
        ...acc,
        [type.name]: buildModel(
          modelName,
          normalizeFilePath(filePath, language),
          filesToTypesMap,
          outputDir,
          language,
        ),
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
      [type.name]: buildModel(
        replacedTypeName,
        filePath,
        filesToTypesMap,
        outputDir,
        language,
      ),
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
