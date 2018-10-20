import chalk from 'chalk'
import { existsSync } from 'fs'
import { DocumentNode } from 'graphql'
import { GraphQLGenDefinition, Language, Models } from 'graphqlgen-json-schema'
import * as path from 'path'
import { findInterfaceByName, interfaceNamesFromTypescriptFile } from './ast'
import {
  outputDefinitionFilesNotFound,
  outputInterfaceDefinitionsNotFound,
  outputMissingModels,
  outputWrongSyntaxFiles,
} from './output'
import { getExtNameFromLanguage } from './path-helpers'
import { extractGraphQLTypes, GraphQLTypeObject } from './source-helper'

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

  if (!validateModels(config.models, schema, language)) {
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
      chalk.redBright(
        `Invalid context: '${chalk.bold(
          validatedContext.definition.rawDefinition,
        )}' does not follow '${chalk.bold(
          'context: <filePath>:<interfaceName>',
        )}' syntax)`,
      ),
    )
    return false
  }

  if (!validatedContext.fileExists) {
    console.log(
      chalk.redBright(
        `Invalid context: file '${chalk.bold(
          validatedContext.definition.filePath!,
        )}' not found`,
      ),
    )
    return false
  }

  if (!validatedContext.interfaceExists) {
    console.log(
      chalk.redBright(
        `Invalid context: interface '${chalk.bold(
          validatedContext.definition.modelName!,
        )}' not found in file '${chalk.bold(
          validatedContext.definition.filePath!,
        )}'`,
      ),
    )
    return false
  }

  return true
}

function validateModels(
  models: Models,
  schema: DocumentNode,
  language: Language,
): boolean {
  // First test if all files are existing
  if (models.files && models.files.length > 0) {
    const invalidFiles = models.files.filter(filePath => !existsSync(filePath))

    invalidFiles.forEach(file => {
      console.log(
        chalk.redBright(
          `Invalid model path: file '${chalk.bold(file)}' not found`,
        ),
      )
    })

    if (invalidFiles.length > 0) {
      return false
    }
  }

  let validatedOverridenModels: ValidatedDefinition[] = []

  if (models.override) {
    // Then tests if overriden models are all valid
    validatedOverridenModels = models.override
      ? Object.keys(models.override).map(typeName =>
          validateDefinition(typeName, models.override![typeName], language),
        )
      : []
  }

  if (!testValidatedDefinitions(validatedOverridenModels)) {
    return false
  }

  // Check whether there's a 1-1 mapping between schema types and models
  if (
    !validateSchemaToModelMapping(
      schema,
      validatedOverridenModels,
      models.files,
    )
  ) {
    return false
  }

  return true
}

function testValidatedDefinitions(
  validatedOverridenModels: ValidatedDefinition[],
) {
  // Check whether the syntax in correct
  if (validatedOverridenModels.some(validation => !validation.validSyntax)) {
    outputWrongSyntaxFiles(validatedOverridenModels)
    return false
  }

  // Check whether the model file exist
  if (validatedOverridenModels.some(validation => !validation.fileExists)) {
    outputDefinitionFilesNotFound(validatedOverridenModels)
    return false
  }

  // Check whether the interface inside the model file exist
  if (
    validatedOverridenModels.some(validation => !validation.interfaceExists)
  ) {
    outputInterfaceDefinitionsNotFound(validatedOverridenModels)
    return false
  }

  return true
}

function validateSchemaToModelMapping(
  schema: DocumentNode,
  validatedOverridenModels: ValidatedDefinition[],
  files: string[] | undefined,
): boolean {
  const graphQLTypes = extractGraphQLTypes(schema)
    .filter(type => !type.type.isInput)
    .filter(
      type => ['Query', 'Mutation', 'Subscription'].indexOf(type.name) === -1,
    )
  const overridenTypeNames = validatedOverridenModels.map(
    def => def.definition.typeName,
  )

  let missingModels: GraphQLTypeObject[] = []

  // Then tests if all
  if (files && files.length > 0) {
    const pathToInterfaceNames: {
      [key: string]: string[]
    } = files.reduce((acc, filePath) => {
      return {
        ...acc,
        [filePath]: interfaceNamesFromTypescriptFile(filePath),
      }
    }, {})

    missingModels = graphQLTypes.filter(type => {
      const typeHasMappingWithAFile = Object.keys(pathToInterfaceNames).some(
        path => pathToInterfaceNames[path].indexOf(type.name) !== -1,
      )

      if (!typeHasMappingWithAFile) {
        return !overridenTypeNames.find(typeName => typeName === type.name)
      }

      return false
    })
  }

  if (
    (!files || (files && files.length === 0)) &&
    overridenTypeNames.length > 0
  ) {
    missingModels = graphQLTypes.filter(
      type => !overridenTypeNames.find(typeName => typeName === type.name),
    )
  }

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
