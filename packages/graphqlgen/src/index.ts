#!/usr/bin/env node

import { parse, DocumentNode } from 'graphql'
import { importSchema } from 'graphql-import'
import * as fs from 'fs'
import * as path from 'path'
import * as chalk from 'chalk'
import * as mkdirp from 'mkdirp'
import * as prettier from 'prettier'
import * as rimraf from 'rimraf'
import { GraphQLGenDefinition, Language } from 'graphqlgen-json-schema'
import {
  extractGraphQLTypes,
  extractGraphQLEnums,
  extractGraphQLUnions,
} from './source-helper'
import { getImportPathRelativeToOutput } from './path-helpers'
import { IGenerator, GenerateArgs, CodeFileLike, ModelMap } from './types'
import {
  generate as generateTS,
  format as formatTS,
} from './generators/ts-generator'
// import {
//   generate as generateReason,
//   format as formatReason,
// } from './generators/reason-generator'
// import {
//   generate as generateFlow,
//   format as formatFlow,
// } from './generators/flow-generator'

import { generate as scaffoldTS } from './generators/ts-scaffolder'
// import { generate as scaffoldFlow } from './generators/flow-scaffolder'
// import { generate as scaffoldReason } from './generators/reason-scaffolder'

import { parseConfig } from './yaml'
import { buildModelMap } from './modelmap'
import { validateConfig } from './validation'

export type GenerateCodeArgs = {
  schema: DocumentNode
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
    // case 'flow':
    //   return { generate: generateFlow, format: formatFlow }
  }

  //TODO: This should never be reached as we validate the yaml before
  throw new Error(`Invalid language: ${language}`)
}

function getResolversGenerator(language: Language): IGenerator {
  switch (language) {
    case 'typescript':
      return { generate: scaffoldTS, format: formatTS }
    // case 'flow':
    //   return { generate: scaffoldFlow, format: formatFlow }
  }

  //TODO: This should never be reached as we validate the yaml before
  throw new Error(`Invalid language: ${language}`)
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
  const contextPath = generateCodeArgs.config.context
    ? getImportPathRelativeToOutput(
        generateCodeArgs.config.context!.split(':')[0].replace(/\.ts$/, ''),
        generateCodeArgs.config!.output,
      )
    : undefined
  const generateArgs: GenerateArgs = {
    types: extractGraphQLTypes(generateCodeArgs.schema!),
    enums: extractGraphQLEnums(generateCodeArgs.schema!),
    unions: extractGraphQLUnions(generateCodeArgs.schema!),
    contextPath, // TODO: use contextPath from graphqlgen.yml
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
      chalk.default.red(
        `Failed to write the file at ${config.output}, error: ${e}`,
      ),
    )
    process.exit(1)
  }
  console.log(
    chalk.default.green(
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
  const outputResolversDir = config['resolver-scaffolding'].output

  rimraf.sync(outputResolversDir)

  resolvers.forEach(f => {
    const writePath = path.join(outputResolversDir, f.path)
    mkdirp.sync(path.dirname(writePath))
    try {
      fs.writeFileSync(
        writePath,
        f.code.replace('[TEMPLATE-INTERFACES-PATH]', config.output),
        {
          encoding: 'utf-8',
        },
      )
    } catch (e) {
      console.error(
        chalk.default.red(
          `Failed to write the file at ${outputResolversDir}, error: ${e}`,
        ),
      )
      process.exit(1)
    }
  })

  console.log(
    chalk.default.green(`Resolvers scaffolded at ${outputResolversDir}`),
  )

  process.exit(0)
}

export function parseSchema(schemaPath: string): DocumentNode {
  if (!fs.existsSync(schemaPath)) {
    console.error(
      chalk.default.red(`The schema file ${schemaPath} does not exist`),
    )
    process.exit(1)
  }

  let schema = undefined
  try {
    schema = importSchema(schemaPath)
  } catch (e) {
    console.error(
      chalk.default.red(`Error occurred while reading schema: ${e}`),
    )
    process.exit(1)
  }

  let parsedSchema = undefined

  try {
    parsedSchema = parse(schema!)
  } catch (e) {
    console.error(chalk.default.red(`Failed to parse schema: ${e}`))
    process.exit(1)
  }

  return parsedSchema!
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

  const config = parseConfig()
  const parsedSchema = parseSchema(config.schema)

  const options = (await prettier.resolveConfig(process.cwd())) || {} // TODO: Abstract this TS specific behavior better
  if (JSON.stringify(options) !== '{}') {
    console.log(chalk.default.blue(`Found a prettier configuration to use`))
  }

  if (!validateConfig(config, parsedSchema)) {
    return false
  }

  //TODO: Should we provide a default in case `config.output.types` is not defined?
  const modelMap = buildModelMap(config.models, config.output, config.language)

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
  /* writeModels(generatedResolvers, config); */
}

// Only call run when running from CLI, not when included for tests
if (require.main === module) {
  run()
}
