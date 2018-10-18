import { ModelMap } from './types'
import {
  getAbsoluteFilePath,
  getImportPathRelativeToOutput,
} from './path-helpers'
import { existsSync } from 'fs'
import * as chalk from 'chalk'
import * as os from 'os'
import { Language } from 'graphqlgen-json-schema'

interface ModelsConfig {
  [typeName: string]: string
}

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

// Check whether the model definition exists in typescript/flow file
function interfaceDefinitionExistsInFile(
  filePath: string,
  modelName: string,
  language: Language,
): boolean {
  filePath
  modelName
  language
  return true
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

  if (!existsSync(filePath)) {
    validation.fileExists = false
  }

  if (
    !interfaceDefinitionExistsInFile(filePath, modelName, language)
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
  process.exit(1)
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
  process.exit(1)
}

function outputInterfaceDefinitionsNotFound(
  validatedDefinitions: ValidatedDefinition[],
) {
  throw new Error('not implemented yet')
}

function validateDefinitions(
  modelsConfig: ModelsConfig,
  language: Language,
): void {
  const validatedDefinitions: ValidatedDefinition[] = Object.keys(
    modelsConfig,
  ).map(typeName =>
    validateDefinition(typeName, modelsConfig[typeName], language),
  )

  if (validatedDefinitions.some(validation => !validation.validSyntax)) {
    return outputWrongSyntaxFiles(validatedDefinitions)
  }

  if (validatedDefinitions.some(validation => !validation.fileExists)) {
    return outputDefinitionFilesNotFound(validatedDefinitions)
  }

  if (validatedDefinitions.some(validation => !validation.interfaceExists)) {
    return outputInterfaceDefinitionsNotFound(validatedDefinitions)
  }
}

/* export function parseDefinition(definition: string) {
  return { filePath,  interfaceDefinition}
} */

export function buildModelMap(
  modelsConfig: ModelsConfig,
  outputDir: string,
  language: Language,
): ModelMap {
  validateDefinitions(modelsConfig, language)

  return Object.keys(modelsConfig).reduce((acc, typeName) => {
    const modelConfig = modelsConfig[typeName]
    const [filePath, modelName] = modelConfig.split(':')
    const absoluteFilePath = getAbsoluteFilePath(filePath)
    const importPathRelativeToOutput = getImportPathRelativeToOutput(
      absoluteFilePath,
      outputDir,
    )
    return {
      ...acc,
      [typeName]: {
        absoluteFilePath,
        importPathRelativeToOutput,
        modelTypeName: modelName,
      },
    }
  }, {})
}
