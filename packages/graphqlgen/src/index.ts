#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import * as mkdirp from 'mkdirp'
import * as prettier from 'prettier'
import * as rimraf from 'rimraf'
import * as yargs from 'yargs'
import { DocumentNode } from 'graphql'
import { GraphQLGenDefinition, Language } from 'graphqlgen-json-schema'
import { GraphQLTypes } from './source-helper'
import {
  getImportPathRelativeToOutput,
  getAbsoluteFilePath,
} from './path-helpers'
import { IGenerator, GenerateArgs, CodeFileLike, ModelMap } from './types'
import {
  generate as generateTS,
  format as formatTS,
} from './generators/ts-generator'
import {
  generate as generateFlow,
  format as formatFlow,
} from './generators/flow-generator'

import { generate as scaffoldTS } from './generators/ts-scaffolder'
import { generate as scaffoldFlow } from './generators/flow-scaffolder'

import { parseConfig, parseContext, parseSchema, parseModels } from './parse'
import { validateConfig } from './validation'
import { handleGlobPattern } from './glob'
import { replaceAll } from './utils'

export type GenerateCodeArgs = {
  schema: GraphQLTypes
  config: GraphQLGenDefinition
  modelMap: ModelMap
  prettify?: boolean
  prettifyOptions?: prettier.Options
  language: Language
}

function getTypesGenerator(language: Language): IGenerator {
  switch (language) {
    case 'typescript':
      return { generate: generateTS, format: formatTS }
    case 'flow':
      return { generate: generateFlow, format: formatFlow }
  }
}

function getResolversGenerator(language: Language): IGenerator {
  switch (language) {
    case 'typescript':
      return { generate: scaffoldTS, format: formatTS }
    case 'flow':
      return { generate: scaffoldFlow, format: formatFlow }
  }
}

function generateTypes(
  generateArgs: GenerateArgs,
  generateCodeArgs: GenerateCodeArgs,
): string {
  const generatorFn: IGenerator = getTypesGenerator(generateCodeArgs.language!)
  const generatedTypes = generatorFn.generate(generateArgs)

  return generateCodeArgs.prettify
    ? generatorFn.format(
        generatedTypes as string,
        generateCodeArgs.prettifyOptions,
      )
    : (generatedTypes as string)
}

function generateResolvers(
  generateArgs: GenerateArgs,
  generateCodeArgs: GenerateCodeArgs,
): CodeFileLike[] {
  const generatorFn: IGenerator = getResolversGenerator(
    generateCodeArgs.language!,
  )
  const generatedResolvers = generatorFn.generate(
    generateArgs,
  ) as CodeFileLike[]

  return generatedResolvers.map(r => {
    return {
      path: r.path,
      force: r.force,
      code: generateCodeArgs.prettify
        ? generatorFn.format(r.code, generateCodeArgs.prettifyOptions)
        : r.code,
    }
  })
}

export function generateCode(
  generateCodeArgs: GenerateCodeArgs,
): { generatedTypes: string; generatedResolvers: CodeFileLike[] } {
  const { schema } = generateCodeArgs
  const generateArgs: GenerateArgs = {
    ...schema,
    context: parseContext(
      generateCodeArgs.config.context,
      generateCodeArgs.config.output,
    ),
    modelMap: generateCodeArgs.modelMap!,
  }
  const generatedTypes = generateTypes(generateArgs, generateCodeArgs)
  const generatedResolvers = generateResolvers(generateArgs, generateCodeArgs)
  // const generatedModels = generateModels(generateArgs, {schema, prettify, prettifyOptions, language})

  return { generatedTypes, generatedResolvers }
}

function writeTypes(types: string, config: GraphQLGenDefinition): void {
  // Create generation target folder, if it does not exist
  // TODO: Error handling around this
  mkdirp.sync(path.dirname(config.output))
  try {
    fs.writeFileSync(config.output, types, { encoding: 'utf-8' })
  } catch (e) {
    console.error(
      chalk.red(`Failed to write the file at ${config.output}, error: ${e}`),
    )
    process.exit(1)
  }
  console.log(
    chalk.green(
      `Resolver interface definitons & default resolvers generated at ${
        config.output
      }`,
    ),
  )
}

function writeResolversScaffolding(
  resolvers: CodeFileLike[],
  config: GraphQLGenDefinition,
) {
  if (!config['resolver-scaffolding']) {
    return
  }
  const outputResolversDir = config['resolver-scaffolding']!.output

  rimraf.sync(outputResolversDir)

  resolvers.forEach(f => {
    const writePath = path.join(outputResolversDir, f.path)
    mkdirp.sync(path.dirname(writePath))
    try {
      fs.writeFileSync(
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

  console.log(chalk.green(`Resolvers scaffolded at ${outputResolversDir}`))

  process.exit(0)
}

function bootstrapYamlFile() {
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
  const outputPath = path.join(process.cwd(), 'graphqlgen.yml')

  if (fs.existsSync(outputPath)) {
    return console.log(chalk.red('graphqlgen.yml file already exists'))
  }

  try {
    fs.writeFileSync(outputPath, yaml, {
      encoding: 'utf-8',
    })
  } catch (e) {
    return console.error(
      chalk.red(`Failed to write the graphqlgen.yml file, error: ${e}`),
    )
  }

  console.log(chalk.green('graphqlgen.yml file created'))
}

async function run() {
  //TODO: Define proper defaults
  // const defaults: DefaultOptions = {
  //   outputInterfaces: 'src/generated/resolvers.ts',
  //   outputScaffold: 'src/resolvers/',
  //   language: 'typescript',
  //   interfaces: '../generated/resolvers.ts',
  //   force: false,
  // }

  const argv = yargs
    .usage('Usage: graphqlgen or gg')
    .alias('i', 'init')
    .describe('i', 'Initialize a graphqlgen.yml file')
    .alias('v', 'version')
    .describe('v', 'Print the version of graphqlgen')
    .version()
    .strict()
    .help('h')
    .alias('h', 'help').argv

  if (argv.i) {
    bootstrapYamlFile()
    return true
  }

  const config = parseConfig()
  const parsedSchema = parseSchema(config.schema)

  const options = (await prettier.resolveConfig(process.cwd())) || {} // TODO: Abstract this TS specific behavior better
  if (JSON.stringify(options) !== '{}') {
    console.log(chalk.blue(`Found a prettier configuration to use`))
  }

  // Override the config.models.files using handleGlobPattern
  config.models = {
    ...config.models,
    files: handleGlobPattern(config.models.files),
  }

  if (!validateConfig(config, parsedSchema)) {
    return false
  }

  //TODO: Should we provide a default in case `config.output.types` is not defined?
  const modelMap = parseModels(
    config.models,
    parsedSchema,
    config.output,
    config.language,
  )

  const { generatedTypes, generatedResolvers } = generateCode({
    schema: parsedSchema!,
    language: config.language,
    prettify: true,
    prettifyOptions: options,
    config,
    modelMap,
  })

  writeTypes(generatedTypes, config)
  writeResolversScaffolding(generatedResolvers, config)
}

// Only call run when running from CLI, not when included for tests
if (require.main === module) {
  run()
}
