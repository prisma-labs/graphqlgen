import * as Path from 'path'
import * as FS from 'fs'
import * as mkdirp from 'mkdirp'
import { GraphQLGenDefinition } from 'graphqlgen-json-schema'
import chalk from 'chalk'
import { CodeFileLike } from './types'
import {
  getImportPathRelativeToOutput,
  getAbsoluteFilePath,
} from './path-helpers'
import { replaceAll } from './utils'

function writeChangesOnly(filename: string, content: string) {
  if (
    !FS.existsSync(filename) ||
    FS.readFileSync(filename, { encoding: 'utf-8' }) !== content
  ) {
    console.log(chalk.green(`Overriding ${filename} with new model`))
    FS.writeFileSync(filename, content)
  } else {
    console.log(chalk.gray(`File ${filename} is the same`))
  }
}

/**
 * Bootstrap a graphqlgen config for the user to finish configuring.
 */
const writeConfigScaffolding = () => {
  const yaml = `\
# The target programming language for the generated code
language: typescript

# The file path pointing to your GraphQL schema
schema: <path-to-your-schema>.graphql

# Type definition for the resolver context object
context: <path-to-file>:<name-of-interface>

# Map SDL types from the GraphQL schema to TS models
models:
  files:
    - <path-to-file>.ts

# Generated typings for resolvers and default resolver implementations
# Please don't edit this file but just import from here
output: <path-to-generated-file>/graphqlgen.ts

# Temporary scaffolded resolvers to copy and paste in your application
resolver-scaffolding:
  output: <path-to-output-dir>
  layout: file-per-type
`
  const outputPath = Path.join(process.cwd(), 'graphqlgen.yml')

  if (FS.existsSync(outputPath)) {
    return console.log(chalk.red('graphqlgen.yml file already exists'))
  }

  try {
    FS.writeFileSync(outputPath, yaml, { encoding: 'utf-8' })
  } catch (e) {
    return console.error(
      chalk.red(`Failed to write the graphqlgen.yml file, error: ${e}`),
    )
  }

  console.log(chalk.green('graphqlgen.yml file created'))
}

/**
 * Output the generated resolver types.
 */
const writeTypes = (
  types: string | CodeFileLike[],
  config: GraphQLGenDefinition,
): void => {
  // Create generation target folder, if it does not exist
  // TODO: Error handling around this
  mkdirp.sync(Path.dirname(config.output))

  if (typeof types === 'string') {
    try {
      writeChangesOnly(config.output, types)
    } catch (e) {
      console.error(
        chalk.red(`Failed to write the file at ${config.output}, error: ${e}`),
      )
      process.exit(1)
    }
  } else {
    const outputTypesDir = config.output
    const toBeCreatedFiles = types.map(f => Path.join(outputTypesDir, f.path))

    if (FS.existsSync(outputTypesDir)) {
      FS.readdirSync(outputTypesDir)
        .map(f => Path.join(outputTypesDir, f))
        .filter(f => !toBeCreatedFiles.includes(f))
        .forEach(f => {
          FS.unlinkSync(f)
          console.log(
            chalk.yellow(
              `Deleting file ${f} - model scaffold no long available`,
            ),
          )
        })
    }

    types.forEach(f => {
      const writePath = Path.join(outputTypesDir, f.path)
      mkdirp.sync(Path.dirname(writePath))
      try {
        writeChangesOnly(writePath, f.code)
      } catch (e) {
        console.error(
          chalk.red(
            `Failed to write the file at ${outputTypesDir}, error: ${e}`,
          ),
        )
        process.exit(1)
      }
    })
  }

  console.log(
    chalk.green(
      `Type definitions for your resolvers generated at ${config.output}`,
    ),
  )
}

/**
 * Output scaffolded resolvers.
 */
const writeResolversScaffolding = (
  resolvers: CodeFileLike[],
  config: GraphQLGenDefinition,
) => {
  if (!config['resolver-scaffolding']) {
    return
  }

  const outputResolversDir = config['resolver-scaffolding'].output

  const toBeCreatedFiles = resolvers.map(f =>
    Path.join(outputResolversDir, f.path),
  )

  if (FS.existsSync(outputResolversDir)) {
    FS.readdirSync(outputResolversDir)
      .map(f => Path.join(outputResolversDir, f))
      .filter(f => !toBeCreatedFiles.includes(f))
      .forEach(f => {
        FS.unlinkSync(f)
        console.log(
          chalk.yellow(`Deleting file ${f} - model scaffold no long available`),
        )
      })
  }

  resolvers.forEach(f => {
    const writePath = Path.join(outputResolversDir, f.path)
    mkdirp.sync(Path.dirname(writePath))
    try {
      writeChangesOnly(
        writePath,
        replaceAll(
          f.code,
          '[TEMPLATE-INTERFACES-PATH]',
          getImportPathRelativeToOutput(
            getAbsoluteFilePath(config.output, config.language),
            writePath,
          ),
        ),
      )
    } catch (e) {
      console.error(
        chalk.red(
          `Failed to write the file at ${outputResolversDir}, error: ${e}`,
        ),
      )
      process.exit(1)
    }
  })

  console.log(
    chalk.green(`Resolvers scaffolded for you at ${outputResolversDir}`),
  )
}

export { writeTypes, writeConfigScaffolding, writeResolversScaffolding }
