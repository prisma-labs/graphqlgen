import * as chalk from 'chalk'
import * as path from 'path'
import { DocumentNode } from 'graphql'
import { existsSync } from 'fs'

import { getExtNameFromLanguage } from './path-helpers'
import { Language, GraphQLGenDefinition } from 'graphqlgen-json-schema'
import { findInterfaceByName } from './ast'
import {
  extractGraphQLTypes,
} from './source-helper'
import {
  outputDefinitionFilesNotFound,
  outputInterfaceDefinitionsNotFound,
  outputMissingModels,
  outputWrongSyntaxFiles,
} from './output'
import { ModelsConfig } from './parse'

type Definition = {
  typeName: string
  rawDefinition: string
  filePath?: string
  modelName?: string
}

export type ValidatedDefinition = {
  definition: Definition
  validSyntax: boolean
  fileExists: boolean
  interfaceExists: boolean
}

export function validateConfig(
  config: GraphQLGenDefinition,
  schema: DocumentNode,
): boolean {
  const language = config.language

  if (!validateContext(config.context, language)) {
    return false
  }

  if (!validateModelMap(config.models, schema, language)) {
    return false
  }

  return true
}

function validateContext(
  contextDefinition: string | undefined,
  language: Language,
): boolean {
  if (!contextDefinition) {
    return true
  }

  const validatedContext = validateDefinition(
    'Context',
    contextDefinition,
    language,
  )

  if (!validatedContext.validSyntax) {
    console.log(
      chalk.default.redBright(
        `Invalid context: '${chalk.default.bold(
          validatedContext.definition.rawDefinition,
        )}' does not follow '${chalk.default.bold(
          'context: <filePath>:<interfaceName>',
        )}' syntax)`,
      ),
    )
    return false
  }

  if (!validatedContext.fileExists) {
    console.log(
      chalk.default.redBright(
        `Invalid context: file '${chalk.default.bold(
          validatedContext.definition.filePath!,
        )}' not found`,
      ),
    )
    return false
  }

  if (!validatedContext.interfaceExists) {
    console.log(
      chalk.default.redBright(
        `Invalid context: interface '${chalk.default.bold(
          validatedContext.definition.modelName!,
        )}' not found in file '${chalk.default.bold(
          validatedContext.definition.filePath!,
        )}'`,
      ),
    )
    return false
  }

  return true
}

function validateModelMap(
  modelsConfig: ModelsConfig,
  schema: DocumentNode,
  language: Language,
): boolean {
  const validatedDefinitions: ValidatedDefinition[] = Object.keys(
    modelsConfig,
  ).map(typeName =>
    validateDefinition(typeName, modelsConfig[typeName], language),
  )

  // Check whether the syntax in correct
  if (validatedDefinitions.some(validation => !validation.validSyntax)) {
    outputWrongSyntaxFiles(validatedDefinitions)
    return false
  }

  // Check whether the model file exist
  if (validatedDefinitions.some(validation => !validation.fileExists)) {
    outputDefinitionFilesNotFound(validatedDefinitions)
    return false
  }

  // Check whether the interface inside the model file exist
  if (validatedDefinitions.some(validation => !validation.interfaceExists)) {
    outputInterfaceDefinitionsNotFound(validatedDefinitions)
    return false
  }

  // Check whether there's a 1-1 mapping between schema types and models
  if (!validateSchemaToModelMapping(schema, validatedDefinitions)) {
    return false
  }

  return true
}

function validateSchemaToModelMapping(
  schema: DocumentNode,
  validatedDefinitions: ValidatedDefinition[],
): boolean {
  const types = extractGraphQLTypes(schema)
  const typeNames = validatedDefinitions.map(def => def.definition.typeName)

  const missingModels = types
    .filter(
      type => ['Query', 'Mutation', 'Subscription'].indexOf(type.name) === -1,
    )
    .filter(type => !typeNames.find(typeName => typeName === type.name))

  if (missingModels.length > 0) {
    outputMissingModels(missingModels)
    return false
  }

  return true
}

/**
 * Support for different path notation
 *
 * './path/to/index.ts' => './path/to/index.ts'
 * './path/to' => './path/to/index.ts'
 * './path/to/' => './path/to/index.ts'
 */

function normalizeFilePath(filePath: string, language: Language): string {
  const ext = getExtNameFromLanguage(language)

  if (path.extname(filePath) !== ext) {
    return path.join(filePath, 'index' + ext)
  }

  return filePath
}

function hasInterfaceInTypescriptFile(
  filePath: string,
  interfaceName: string,
): boolean {
  return !!findInterfaceByName(filePath, interfaceName)
}

// Check whether the model definition exists in typescript/flow file
function interfaceDefinitionExistsInFile(
  filePath: string,
  modelName: string,
  language: Language,
): boolean {
  switch (language) {
    case 'typescript':
      return hasInterfaceInTypescriptFile(filePath, modelName)
  }
}

export function validateDefinition(
  typeName: string,
  definition: string,
  language: Language,
): ValidatedDefinition {
  let validation: ValidatedDefinition = {
    definition: {
      typeName,
      rawDefinition: definition,
    },
    validSyntax: true,
    fileExists: true,
    interfaceExists: true,
  }

  if (definition.split(':').length !== 2) {
    validation.validSyntax = false
    validation.fileExists = false
    validation.interfaceExists = false

    return validation
  }

  const [filePath, modelName] = definition.split(':')

  validation.definition.filePath = filePath
  validation.definition.modelName = modelName

  const normalizedFilePath = normalizeFilePath(filePath, language)

  if (!existsSync(normalizedFilePath)) {
    validation.fileExists = false
    validation.interfaceExists = false

    return validation
  }

  if (
    !interfaceDefinitionExistsInFile(normalizedFilePath, modelName, language)
  ) {
    validation.interfaceExists = false
  }

  return validation
}
