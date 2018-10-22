import chalk from 'chalk'
import { existsSync } from 'fs'
import { DocumentNode } from 'graphql'
import { GraphQLGenDefinition, Language, Models } from 'graphqlgen-json-schema'
import { findTypescriptInterfaceByName, getTypeNamesFromPath } from './ast'
import {
  outputDefinitionFilesNotFound,
  outputInterfaceDefinitionsNotFound,
  outputMissingModels,
  outputModelFilesNotFound,
  outputWrongSyntaxFiles,
} from './output'
import { extractGraphQLTypesWithoutRootsAndInputs } from './source-helper'
import { normalizeFilePath } from './utils'
import { replaceVariablesInString } from './parse'

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

  return validateModels(
    config.models,
    schema,
    language,
    config.models.defaultName,
  )
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
  defaultName?: string,
): boolean {
  const filePaths = !!models.files
    ? models.files.map(file => normalizeFilePath(file, language))
    : []
  const overriddenModels = !!models.override ? models.override : {}
  // First test if all files are existing
  if (filePaths.length > 0) {
    const invalidFiles = filePaths.filter(filePath => !existsSync(filePath))

    if (invalidFiles.length > 0) {
      outputModelFilesNotFound(invalidFiles)
      return false
    }
  }

  // Then validate all overridden models
  const validatedOverriddenModels: ValidatedDefinition[] = Object.keys(
    overriddenModels,
  ).map(typeName =>
    validateDefinition(typeName, models.override![typeName], language),
  )

  if (!testValidatedDefinitions(validatedOverriddenModels)) {
    return false
  }

  // Then check whether there's a 1-1 mapping between schema types and models
  return validateSchemaToModelMapping(
    schema,
    validatedOverriddenModels,
    filePaths,
    defaultName,
  )
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
  validatedOverriddenModels: ValidatedDefinition[],
  files: string[],
  defaultName?: string,
): boolean {
  const graphQLTypes = extractGraphQLTypesWithoutRootsAndInputs(schema)
  const overridenTypeNames = validatedOverriddenModels.map(
    def => def.definition.typeName,
  )
  const interfaceNamesToPath = getTypeNamesFromPath(files)

  const missingModels = graphQLTypes.filter(type => {
    // If some overridden models are mapped to a GraphQL type, consider them valid
    if (overridenTypeNames.some(typeName => typeName === type.name)) {
      return false
    }

    // If an interface is found with the same name as a GraphQL type, consider them valid
    const typeHasMappingWithAFile = Object.keys(interfaceNamesToPath).some(
      interfaceName =>
        interfaceName === replaceDefaultName(type.name, defaultName),
    )

    return !typeHasMappingWithAFile
  })

  if (missingModels.length > 0) {
    outputMissingModels(missingModels)
    return false
  }

  return true
}

function replaceDefaultName(typeName: string, defaultName?: string) {
  return defaultName
    ? replaceVariablesInString(defaultName, { typeName })
    : typeName
}

// Check whether the model definition exists in typescript/flow file
function interfaceDefinitionExistsInFile(
  filePath: string,
  modelName: string,
  language: Language,
): boolean {
  switch (language) {
    case 'typescript':
      return !!findTypescriptInterfaceByName(filePath, modelName)
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
