#!/usr/bin/env node

import chalk from 'chalk'
import * as prettier from 'prettier'
import * as yargs from 'yargs'
import { GraphQLGenDefinition, Language } from 'graphqlgen-json-schema'
import { GraphQLTypes } from './source-helper'
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
import * as Project from './project-output'

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

/**
 * The CLI interface
 */
async function run() {
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
    Project.writeConfigScaffolding()
    return true
  }

  const config = parseConfig()
  const parsedSchema = parseSchema(config.schema)

  // Override the config.models.files using handleGlobPattern
  config.models = {
    ...config.models,
    files: handleGlobPattern(config.models.files),
  }

  if (!validateConfig(config, parsedSchema)) {
    return false
  }

  const modelMap = parseModels(
    config.models,
    parsedSchema,
    config.output,
    config.language,
  )

  const options = (await prettier.resolveConfig(process.cwd())) || {} // TODO: Abstract this TS specific behavior better

  if (JSON.stringify(options) !== '{}') {
    console.log(chalk.blue(`Found a prettier configuration to use`))
  }

  const { generatedTypes, generatedResolvers } = generateCode({
    schema: parsedSchema!,
    language: config.language,
    prettify: true,
    prettifyOptions: options,
    config,
    modelMap,
  })

  Project.writeTypes(generatedTypes, config)
  Project.writeResolversScaffolding(generatedResolvers, config)
}

// Only call run when running from CLI, not when included for tests
if (require.main === module) {
  run()
}
