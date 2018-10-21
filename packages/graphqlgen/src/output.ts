import chalk from 'chalk'
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
  
${chalk.bold(
    'Step 1',
  )}: Make sure each of these model definitions point to an existing file

  models:
    override:
    ${invalidDefinitions
      .map(
        def =>
          `  ${def.definition.typeName}: ${chalk.redBright(
            def.definition.filePath!,
          )}:${def.definition.modelName}`,
      )
      .join(os.EOL)}

${chalk.bold('Step 2')}: Re-run ${chalk.bold('`graphqlgen`')}`)
}

export function outputWrongSyntaxFiles(
  validatedDefinitions: ValidatedDefinition[],
) {
  const invalidDefinitions = validatedDefinitions.filter(
    validation => !validation.validSyntax,
  )

  console.log(`❌ Some model definitions defined in your graphqlgen.yml have syntax errors
  
${chalk.bold(
    'Step 1',
  )}: Make sure each of these model definitions follow the correct syntax

  ${chalk.cyan(
    `(Correct syntax: ${chalk.bold('<typeName>')}: ${chalk.bold(
      '<filePath>',
    )}:${chalk.bold('<modelName>')})`,
  )}

  models:
    override:
    ${invalidDefinitions
      .map(def =>
        chalk.redBright(
          `  ${def.definition.typeName}: ${def.definition.rawDefinition}`,
        ),
      )
      .join(os.EOL)}

${chalk.bold('Step 2')}: Re-run ${chalk.bold('`graphqlgen`')}`)
}

export function outputInterfaceDefinitionsNotFound(
  validatedDefinitions: ValidatedDefinition[],
) {
  const invalidDefinitions = validatedDefinitions.filter(
    validation => !validation.interfaceExists,
  )

  console.log(`❌ Some model definitions defined in your graphqlgen.yml were not found
  
${chalk.bold(
    'Step 1',
  )}: Make sure each of these model definitions are defined in the following files

  models:
    override:
    ${invalidDefinitions
      .map(
        def =>
          `  ${def.definition.typeName}: ${
            def.definition.filePath
          }:${chalk.redBright(def.definition.modelName!)}`,
      )
      .join(os.EOL)}

${chalk.bold('Step 2')}: Re-run ${chalk.bold('`graphqlgen`')}`)
}

export function outputMissingModels(missingModels: GraphQLTypeObject[]) {
  console.log(`❌ Some types from your application schema have model definitions that are not defined yet
  
${chalk.bold(
    'Step 1',
  )}: Copy/paste the model definitions below to your application

${missingModels.map(renderModelFromType).join(os.EOL)}


${chalk.bold('Step 2')}: Reference the model definitions in your ${chalk.bold(
    'graphqlgen.yml',
  )} file

models:
  files:
    - ./path/to/your/file.ts  

${chalk.bold('Step 3')}: Re-run ${chalk.bold('`graphqlgen`')}`)
}

function renderModelFromType(type: GraphQLTypeObject): string {
  return `\
export interface ${chalk.bold(type.name)} {
${type.fields
    .map(field => `  ${field.name}: ${graphQLToTypecriptType(field.type)}`)
    .join(os.EOL)}
}`
}

export function outputModelFilesNotFound(filesNotFound: string[]) {
  console.log(`❌ Some path to model definitions defined in your graphqlgen.yml were not found
  
${chalk.bold('Step 1')}: Make sure each of these files exist

  models:
    files:
    ${filesNotFound.map(file => `  - ${chalk.redBright(file)}`).join(os.EOL)}

${chalk.bold('Step 2')}: Re-run ${chalk.bold('`graphqlgen`')}`)
}
