#!/usr/bin/env node

import * as path from 'path'
import * as meow from 'meow'
import * as inquirer from 'inquirer'
import { loadGraphQLGenStarter } from './loader'
import { defaultStarter } from './starters'

const cli = meow(
  `
    create-graphqlgen [dir]

    > Scaffolds the initial files of your project.
`,
  {
    flags: {
      'no-install': {
        type: 'boolean',
        default: false,
      },
    },
  },
)

main(cli)

// Main

async function main(cli: meow.Result) {
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
      },
    ])

    output = res.path
  }

  loadGraphQLGenStarter(defaultStarter, path.resolve(output), {
    installDependencies: cli.flags['no-install'],
  })
}
