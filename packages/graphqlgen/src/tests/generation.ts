import * as ts from 'typescript'
import * as rimraf from 'rimraf'
import * as path from 'path'
import { GraphQLGenDefinition } from 'graphqlgen-json-schema'
import { parseModels, parseSchema } from '../parse'
import { validateConfig } from '../validation'
import { generateCode, writeResolversScaffolding, writeTypes } from '../index'

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

export function testGeneration(config: GraphQLGenDefinition) {
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

  const compiledOutputDir = path.join(path.dirname(config.output), 'compiled')

  if (config.language === 'typescript') {
    compileTypescript(fileNames, compiledOutputDir)
  }

  if (config.language === 'flow') {
    // compileFlow(fileNames)
  }

  rimraf.sync(path.dirname(config.output))
}
