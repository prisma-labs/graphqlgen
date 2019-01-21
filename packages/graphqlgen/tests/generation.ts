import * as ts from 'typescript'
import { EOL } from 'os'
import * as rimraf from 'rimraf'
import * as path from 'path'
import { execFile } from 'child_process'
import { writeFileSync } from 'fs'
import chalk from 'chalk'
import { File, GraphQLGenDefinition } from 'graphqlgen-json-schema'
import { getPath, parseModels, parseSchema } from '../src/parse'
import { validateConfig } from '../src/validation'
import { writeResolversScaffolding, writeTypes } from '../src/project-output'
import { generateCode } from '../src/index'
const flow = require('flow-bin')

class ExecError extends Error {
  constructor(
    public message: string,
    public stdout: string,
    public stderr: string,
  ) {
    super(message)
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

const exec = (command: string, args: string[]): Promise<ExecError | string> => {
  return new Promise(resolve => {
    return execFile(command, args, (err, stdout, stderr) => {
      if (err) {
        resolve(new ExecError(err.message, stdout, stderr))
      } else {
        resolve(stdout)
      }
    })
  })
}

function printTypescriptErrors(diagnotics: ReadonlyArray<ts.Diagnostic>) {
  diagnotics.forEach(diagnostic => {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!,
      )
      const message = ts.flattenDiagnosticMessageText(
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

  const flowConfigName = `.flowconfig-${Math.random()}`
  const flowConfigPath = path.join(path.dirname(typesPath), flowConfigName)

  writeFileSync(flowConfigPath, flowConfig)

  const result = await exec(flow, [
    'check',
    '--flowconfig-name',
    flowConfigName,
    path.resolve(path.dirname(typesPath)),
  ])

  if (result instanceof ExecError) {
    const errorDelimiter =
      'Error ----------------------------------------------------------------'

    const errors = result.stdout
      .split(errorDelimiter)
      // Do not take into account error from 'import type { GraphQLResolveInfo } from "graphql"'
      .filter(
        error =>
          error.length !== 0 &&
          !error.includes('Cannot resolve module `graphql`'),
      )

    if (errors.length > 0) {
      const message = errors
        .map(error => `${chalk.red(errorDelimiter) + EOL}${error}`)
        .join(EOL)
      throw new Error(message)
    }
  }
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

  if (config.language === 'typescript') {
    compileTypescript(fileNames, compiledOutputDir)
  }

  if (config.language === 'flow') {
    await compileFlow(config.models.files!, config.output)
  }

  rimraf.sync(path.dirname(config.output))
}
