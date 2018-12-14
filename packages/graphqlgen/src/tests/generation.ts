import * as ts from 'typescript'
import { EOL } from 'os'
import * as rimraf from 'rimraf'
import * as path from 'path'
import { execFile } from 'child_process'
import { writeFileSync } from 'fs'
import chalk from 'chalk'
import { File, GraphQLGenDefinition } from 'graphqlgen-json-schema'
import { getPath, parseModels, parseSchema } from '../parse'
import { validateConfig } from '../validation'
import { generateCode, writeResolversScaffolding, writeTypes } from '../index'
const flow = require('flow-bin')

function printTypescriptErrors(diagnotics: ReadonlyArray<ts.Diagnostic>) {
  diagnotics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!,
      )
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n',
      )
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character +
          1}): ${message}`,
      )
    } else {
      console.log(
        `${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`,
      )
    }
  })
}

function compileTypescript(fileNames: string[], compiledOutputDir: string) {
  const errors = ts
    .createProgram(fileNames, {
      sourceMap: false,
      noEmitOnError: true,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.CommonJS,
      outDir: compiledOutputDir,
    })
    .emit().diagnostics

  if (errors.length > 0) {
    printTypescriptErrors(errors)
  }

  expect(errors.length).toEqual(0)
}

async function compileFlow(includeFiles: File[], typesPath: string) {
  const flowConfig = `
[ignore]

[include]
${includeFiles.map(file => getPath(file)).join(EOL)}

[libs]

[lints]

[options]

[strict]
  `

  writeFileSync(path.join(path.dirname(typesPath), '.flowconfig'), flowConfig)

  const stdout = await new Promise(resolve => {
    return execFile(
      flow,
      ['check', path.resolve(path.dirname(typesPath))],
      (_err: any, stdout: string) => {
        resolve(stdout)
      },
    )
  })

  const errorDelimiter =
    'Error ----------------------------------------------------------------'
  // Do not take into account error from 'import type { GraphQLResolveInfo } from "graphql"'
  const errors = (stdout as string)
    .split(errorDelimiter)
    .filter(
      error =>
        error.length !== 0 &&
        !error.includes('Cannot resolve module `graphql`'),
    )

  if (errors.length > 0) {
    console.log(
      errors
        .map(error => `${chalk.red(errorDelimiter) + EOL}${error}`)
        .join(EOL),
    )
  }

  expect(errors.length).toEqual(0)
}

export async function testGeneration(config: GraphQLGenDefinition) {
  const schema = parseSchema(config.schema)

  expect(validateConfig(config, schema)).toBe(true)

  const modelMap = parseModels(
    config.models,
    schema,
    config.output,
    config.language,
  )
  const { generatedTypes, generatedResolvers } = generateCode({
    schema,
    language: config.language,
    config,
    modelMap,
    prettify: true,
  })

  expect(generatedTypes).toMatchSnapshot()
  expect(generatedResolvers).toMatchSnapshot()

  const restoreLog = console.log

  // Mock console.log
  console.log = jest.fn()

  writeTypes(generatedTypes, config)
  writeResolversScaffolding(generatedResolvers, config)

  // Restore console log to print errors if there are any
  console.log = restoreLog

  const outputResolversDir = config['resolver-scaffolding']!.output

  const fileNames = [
    ...generatedResolvers.map(resolver =>
      path.join(outputResolversDir, resolver.path),
    ),
    config.output,
  ]

  const compiledOutputDir = path.join(
    path.dirname(config.output),
    String(Math.random()),
  )

  compiledOutputDir
  fileNames
  compileTypescript
  compileFlow

  // if (config.language === 'typescript') {
  //   compileTypescript(fileNames, compiledOutputDir)
  // }

  // if (config.language === 'flow') {
  //   await compileFlow(config.models.files!, config.output)
  // }

  rimraf.sync(path.dirname(config.output))
}
