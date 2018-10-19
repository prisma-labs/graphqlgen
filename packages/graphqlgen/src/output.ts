import * as chalk from 'chalk'
import * as os from 'os'
import { graphQLToTypecriptType, GraphQLTypeObject } from './source-helper'
import { ValidatedDefinition } from './validation'

export function outputDefinitionFilesNotFound(
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

export function outputWrongSyntaxFiles(validatedDefinitions: ValidatedDefinition[]) {
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

export function outputInterfaceDefinitionsNotFound(
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

export function outputMissingModels(missingModels: GraphQLTypeObject[]) {
  console.log(`❌ Some types from your application schema have model definitions that are not defined yet
  
${chalk.default.bold(
    'Step 1',
  )}: Copy/paste the model definitions below to your application

${missingModels.map(renderModelFromType).join(os.EOL)}

${chalk.default.bold(
    'Step 2',
  )}: Reference the model definitions in your graphqlgen.yml file

models:
  ${missingModels.map(renderPlaceholderModels).join(os.EOL)}

${chalk.default.bold('Step 3')}: Re-run \`graphqlgen\``)
}

function renderPlaceholderModels(type: GraphQLTypeObject): string {
  return `${type.name}: <path-to-your-file.ts>: ${type.name}`
}

function renderModelFromType(type: GraphQLTypeObject): string {
  return `• ${chalk.default.bold(type.name)}.ts

interface ${chalk.default.bold(type.name)} {
${type.fields
    .map(field => `  ${field.name}: ${graphQLToTypecriptType(field.type)}`)
    .join(os.EOL)}
}`
}
