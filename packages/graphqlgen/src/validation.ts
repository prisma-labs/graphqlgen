import * as chalk from 'chalk'
import * as path from 'path'
import * as os from 'os'
import * as ts from 'typescript'

import { existsSync, readFileSync } from 'fs'
import { getExtNameFromLanguage } from './path-helpers'

import { Language } from 'graphqlgen-json-schema'
import { ModelsConfig } from './modelmap'

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

export function validateModelMap(
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

export function validateContext(contextDefinition: string, language: Language) {
  const validatedContext = validateDefinition('Context', contextDefinition, language);

  //TODO: Provide better error messages for each case
  if (!validatedContext.validSyntax || !validatedContext.fileExists || !validatedContext.interfaceExists) {
    console.log(chalk.default.redBright('Invalid context'));
    process.exit(1);
  }
}

/**
 * Support for different path notation
 *
 * './path/to/index.ts' => './path/to/index.ts'
 * './path/to' => './path/to/index.ts'
 * './path/to/' => './path/to/index.ts'
 */

function normalizeFilePath(filePath: string, language: Language) {
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
  const fileName = path.basename(filePath)

  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(filePath).toString(),
    ts.ScriptTarget.ES2015,
  )

  // NOTE unfortunately using `.getChildren()` didn't work, so we had to use the `forEachChild` method
  const nodes: ts.Node[] = []
  sourceFile.forEachChild(node => {
    nodes.push(node)
  })

  const node = nodes.find(
    node =>
      node.kind === ts.SyntaxKind.InterfaceDeclaration &&
      (node as ts.InterfaceDeclaration).name.escapedText === interfaceName,
  )

  return !!node
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
          }: ${chalk.default.redBright(def.definition.modelName!)}`,
      )
      .join(os.EOL)}

${chalk.default.bold('Step 2')}: Re-run \`graphqlgen\``)
  process.exit(1)
}
