import * as chalk from 'chalk'
import * as path from 'path'
import * as os from 'os'

import { existsSync } from 'fs'
import { getExtNameFromLanguage } from './path-helpers'

import { Language, GraphQLGenDefinition } from 'graphqlgen-json-schema'
import { ModelsConfig } from './modelmap'
import { findInterfaceByName } from './ast'
import { DocumentNode } from 'graphql'
import {
  extractGraphQLTypes,
  GraphQLTypeObject,
  graphQLToTypecriptType,
} from './source-helper'

type Definition = {
  typeName: string
  rawDefinition: string
  filePath?: string
  modelName?: string
}

type ValidatedDefinition = {
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

  if (validatedDefinitions.some(validation => !validation.validSyntax)) {
    outputWrongSyntaxFiles(validatedDefinitions)
    return false
  }

  if (validatedDefinitions.some(validation => !validation.fileExists)) {
    outputDefinitionFilesNotFound(validatedDefinitions)
    return false
  }

  if (validatedDefinitions.some(validation => !validation.interfaceExists)) {
    outputInterfaceDefinitionsNotFound(validatedDefinitions)
    return false
  }

  if (!validateSchemaToModelMapping(schema, validatedDefinitions)) {
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

  //TODO: Provide better error messages for each case
  if (
    !validatedContext.validSyntax ||
    !validatedContext.fileExists ||
    !validatedContext.interfaceExists
  ) {
    console.log(chalk.default.redBright('Invalid context'))
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

function validateDefinition(
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

function outputDefinitionFilesNotFound(
  validatedDefinitions: ValidatedDefinition[],
) {
  const invalidDefinitions = validatedDefinitions.filter(
    validation => !validation.fileExists,
  )

  console.log(`❌ Some path to model definitions defined in your graphqlgen.yml were not found
  
${chalk.default.bold(
    'Step 1',
  )}: Make sure each of these model definitions point to an existing file

  models:
    ${invalidDefinitions
      .map(
        def =>
          `${def.definition.typeName}: ${chalk.default.redBright(
            def.definition.filePath!,
          )}:${def.definition.modelName}`,
      )
      .join(os.EOL)}

  ${chalk.default.bold('Step 2')}: Re-run \`graphqlgen\``)
}

function outputWrongSyntaxFiles(validatedDefinitions: ValidatedDefinition[]) {
  const invalidDefinitions = validatedDefinitions.filter(
    validation => !validation.validSyntax,
  )

  console.log(`❌ Some model definitions defined in your graphqlgen.yml have syntax errors
  
${chalk.default.bold(
    'Step 1',
  )}: Make sure each of these model definitions follow the correct syntax

  ${chalk.default.cyan(
    `(Correct syntax: ${chalk.default.bold('<typeName>')}: ${chalk.default.bold(
      '<filePath>',
    )}:${chalk.default.bold('<modelName>')})`,
  )}

  models:
    ${invalidDefinitions
      .map(def =>
        chalk.default.redBright(
          `${def.definition.typeName}: ${def.definition.rawDefinition}`,
        ),
      )
      .join(os.EOL)}

${chalk.default.bold('Step 2')}: Re-run \`graphqlgen\``)
}

function outputInterfaceDefinitionsNotFound(
  validatedDefinitions: ValidatedDefinition[],
) {
  const invalidDefinitions = validatedDefinitions.filter(
    validation => !validation.interfaceExists,
  )

  console.log(`❌ Some model definitions defined in your graphqlgen.yml were not found
  
${chalk.default.bold(
    'Step 1',
  )}: Make sure each of these model definitions are defined in the following files

  models:
    ${invalidDefinitions
      .map(
        def =>
          `${def.definition.typeName}: ${
            def.definition.filePath
          }:${chalk.default.redBright(def.definition.modelName!)}`,
      )
      .join(os.EOL)}

${chalk.default.bold('Step 2')}: Re-run \`graphqlgen\``)
}

function outputMissingModels(missingModels: GraphQLTypeObject[]) {
  console.log(`❌ Some types from your application schema have model definitions that are not defined yet
  
${chalk.default.bold(
    'Step 1',
  )}: Copy/paste the model definitions below to your application

${missingModels.map(renderModelFromType).join(os.EOL)}

${chalk.default.bold('Step 2')}: Reference the model definitions in your graphqlgen.yml file

models:
  ${missingModels.map(renderPlaceholderModels).join(os.EOL)}

${chalk.default.bold('Step 3')}: Re-run \`graphqlgen\``)
}

function renderPlaceholderModels(type: GraphQLTypeObject): string {
  return `${type.name}: <path-to-your-file.ts>: ${type.name}`;
}

function renderModelFromType(type: GraphQLTypeObject): string {
  return (
    `• ${chalk.default.bold(type.name)}.ts

interface ${chalk.default.bold(type.name)} {
${type.fields
      .map(field => `  ${field.name}: ${graphQLToTypecriptType(field.type)}`)
      .join(os.EOL)}
}`
  )
}
