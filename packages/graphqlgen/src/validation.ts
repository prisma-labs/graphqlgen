import chalk from 'chalk'
import { existsSync } from 'fs'
import { GraphQLGenDefinition, Language, Models } from 'graphqlgen-json-schema'
import {
  outputDefinitionFilesNotFound,
  outputInterfaceDefinitionsNotFound,
  outputMissingModels,
  outputModelFilesNotFound,
  outputWrongSyntaxFiles,
} from './output'
import {
  extractGraphQLTypesWithoutRootsAndInputsAndEnums,
  GraphQLTypes,
} from './source-helper'
import { normalizeFilePath, getTypeToFileMapping } from './utils'
import {
  replaceVariablesInString,
  getPath,
  getDefaultName,
  normalizeFiles,
  NormalizedFile,
} from './parse'
import { buildFilesToTypesMap, findTypeInFile } from './introspection'

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
  schema: GraphQLTypes,
): boolean {
  const language = config.language

  if (!validateContext(config.context, language)) {
    return false
  }

  return validateModels(config.models, schema, language)
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

export function validateModels(
  models: Models,
  schema: GraphQLTypes,
  language: Language,
): boolean {
  const normalizedFiles = normalizeFiles(models.files, language)
  const overriddenModels = !!models.override ? models.override : {}

  // Make sure all files exist
  if (normalizedFiles.length > 0) {
    const invalidFiles = normalizedFiles.filter(
      file => !existsSync(getPath(file)),
    )

    if (invalidFiles.length > 0) {
      outputModelFilesNotFound(invalidFiles.map(f => f.path))
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
    normalizedFiles,
    language,
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
  schema: GraphQLTypes,
  validatedOverriddenModels: ValidatedDefinition[],
  normalizedFiles: NormalizedFile[],
  language: Language,
): boolean {
  const graphQLTypes = extractGraphQLTypesWithoutRootsAndInputsAndEnums(schema)
  const overridenTypeNames = validatedOverriddenModels.map(
    def => def.definition.typeName,
  )

  const filesToTypesMap = buildFilesToTypesMap(normalizedFiles, language)
  const interfaceNamesToPath = getTypeToFileMapping(
    normalizedFiles,
    filesToTypesMap,
  )

  const missingModels = graphQLTypes.filter(type => {
    // If some overridden models are mapped to a GraphQL type, consider them valid
    if (overridenTypeNames.some(typeName => typeName === type.name)) {
      return false
    }

    // If an interface is found with the same name as a GraphQL type, consider them valid
    const typeHasMappingWithAFile = Object.keys(interfaceNamesToPath).some(
      interfaceName => {
        const file = interfaceNamesToPath[interfaceName]
        const defaultName = getDefaultName(file)
        return interfaceName === maybeReplaceDefaultName(type.name, defaultName)
      },
    )

    return !typeHasMappingWithAFile
  })

  if (missingModels.length > 0) {
    // Append the user's chosen defaultName pattern to the step 1 missing models,
    // but only if they have the same pattern for all of their files
    let defaultName: string | null = null
    if (normalizedFiles.length > 0) {
      const names = normalizedFiles.map(getDefaultName)
      if (names.every(name => name === names[0])) {
        defaultName = names[0]
      }
    }
    outputMissingModels(missingModels, language, defaultName)
    return false
  }

  return true
}

export function maybeReplaceDefaultName(
  typeName: string,
  defaultName?: string | null,
) {
  return defaultName
    ? replaceVariablesInString(defaultName, { typeName })
    : typeName
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

  if (!findTypeInFile(normalizedFilePath, modelName, language)) {
    validation.interfaceExists = false
  }

  return validation
}
