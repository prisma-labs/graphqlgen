#!/usr/bin/env node

import * as path from 'path'
import * as fs from 'fs'
import * as meow from 'meow'
import * as inquirer from 'inquirer'
import * as Loader from './loader'
import * as Templates from './templates'

const cli = meow(
  `
    create-graphqlgen [dir]

    > Scaffolds the initial files of your project.

    Options:
      -t, --template  Select a template. (${Templates.templatesNames})
      --no-install    Skips dependency installation.
      --no-generate   Skips model generation.
      --force (-f)    Overwrites existing files.
`,
  {
    flags: {
      'no-install': {
        type: 'boolean',
        default: false,
      },
      'no-generate': {
        type: 'boolean',
        default: false,
      },
      template: {
        type: 'string',
        alias: 't',
        default: false,
      },
      force: {
        type: 'boolean',
        default: false,
        alias: 'f',
      },
    },
  },
)

const main = async (cli: meow.Result) => {
  let template = Templates.defaultTemplate

  if (cli.flags['template']) {
    const selectedTemplate = Templates.availableTemplates.find(
      t => t.name === cli.flags['template'],
    )

    if (selectedTemplate) {
      template = selectedTemplate
    } else {
      console.log(
        `Unknown template. Available templates: ${Templates.templatesNames}`,
      )
      return
    }
  } else {
    const res = await inquirer.prompt<{ templateName: string }>([
      {
        name: 'templateName',
        message: 'Choose a GraphQL server template?',
        type: 'list',
        choices: Templates.availableTemplates.map(t => ({
          name: `${t.name} (${t.description})`,
          value: t.name,
        })),
      },
    ])

    template = Templates.availableTemplates.find(
      t => t.name === res.templateName,
    )
  }

  let [output] = cli.input

  interface PathResponse {
    path: string
  }

  if (!output) {
    const res = await inquirer.prompt<PathResponse>([
      {
        name: 'path',
        message: 'Where should we scaffold graphql server?',
        type: 'input',
        default: '.',
      },
    ])

    output = res.path
  }

  if (fs.existsSync(output)) {
    const allowedFiles = ['.git', '.gitignore']
    const conflictingFiles = fs
      .readdirSync(output)
      .filter(f => !allowedFiles.includes(f))

    if (conflictingFiles.length > 0 && !cli.flags.force) {
      console.log(`Directory ${output} must be empty.`)
      return
    }
  } else {
    fs.mkdirSync(output)
  }

  Loader.loadGraphQLGenStarter(template, path.resolve(output), {
    installDependencies: !cli.flags['no-install'],
    generateModels: !cli.flags['no-generate'],
  })
}

main(cli)
