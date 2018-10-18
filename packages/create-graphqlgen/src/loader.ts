import * as Zip from 'adm-zip'
import * as tmp from 'tmp'
import * as github from 'parse-github-url'
import * as fs from 'fs'
import * as ora from 'ora'
import * as request from 'request'
import * as execa from 'execa'
import chalk from 'chalk'

import { Starter } from './starters'

export interface LoadOptions {
  installDependencies: boolean
  generateModels: boolean
}

export async function loadGraphQLGenStarter(
  starter: Starter,
  output: string,
  options: LoadOptions,
): Promise<void> {
  const zip = getGraphQLGenStarterRepositoryZipInformation(starter)
  const tmp = await downloadRepository(zip)

  await extractGraphQLGenStarterFromRepository(tmp, zip, output)

  if (options.installDependencies) {
    await installGraphQLGenStarter(output)
  }

  if (options.generateModels) {
    await generateGraphQLGenStarterModels(output)
  }

  printHelpMessage()
}

interface StarterRepositoryZipInformation {
  uri: string
  path: string
}

function getGraphQLGenStarterRepositoryZipInformation(
  starter: Starter,
): StarterRepositoryZipInformation {
  const meta = github(starter.repo.uri)

  const uri = `${starter.repo.uri}/archive/${starter.repo.branch}.zip`
  const normalizedBranch = starter.repo.branch.replace('/', '-')
  const path = `${meta.name}-${normalizedBranch}/${starter.repo.path}/`

  return { uri, path }
}

async function downloadRepository(
  zip: StarterRepositoryZipInformation,
): Promise<string> {
  const spinner = ora(`Downloading starter from ${chalk.cyan(zip.uri)}`).start()

  const tmpPath = tmp.fileSync({
    postfix: '.zip',
  })

  await new Promise(resolve => {
    request(zip.uri)
      .pipe(fs.createWriteStream(tmpPath.name))
      .on('close', resolve)
  })

  spinner.succeed()

  return tmpPath.name
}

async function extractGraphQLGenStarterFromRepository(
  tmp: string,
  repo: StarterRepositoryZipInformation,
  output: string,
): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const spinner = ora(`Extracting content to ${chalk.cyan(output)}`)

    try {
      const zip = new Zip(tmp)
      const extract = zip.extractEntryTo(repo.path, output, false, true)

      spinner.succeed()

      resolve(extract)
    } catch (err) {
      spinner.fail()

      reject(err)
    }
  })
}

async function installGraphQLGenStarter(path: string): Promise<void> {
  const spinner = ora(`Installing dependencies 👩‍🚀`).start()

  process.chdir(path)

  try {
    if (await isYarnInstalled()) {
      await execa.shellSync('yarnpkg install', { stdio: `ignore` })
    } else {
      await execa.shellSync('npm install', { stdio: `ignore` })
    }

    spinner.succeed()
  } catch (err) {
    spinner.fail()
  }
}

async function generateGraphQLGenStarterModels(path: string): Promise<void> {
  const spinner = ora(`Generating models 👷‍`).start()

  process.chdir(path)

  try {
    if (await isYarnInstalled()) {
      await execa.shellSync('yarn generate', { stdio: `ignore` })
    } else {
      await execa.shellSync('npm run generate', { stdio: `ignore` })
    }

    spinner.succeed()
  } catch (err) {
    spinner.fail()
  }
}

async function isYarnInstalled(): Promise<boolean> {
  try {
    await execa.shell(`yarnpkg --version`, { stdio: `ignore` })
    return true
  } catch (err) {
    return false
  }
}

function printHelpMessage(): void {
  const message = `
Your GraphQL server has been successfully set up!

Try running the following commands:
  - ${chalk.yellow(`yarn start`)}
     Starts the GraphQL server.

  - ${chalk.greenBright(`yarn generate`)}
     Generates type safe interfaces from your schema.
`

  console.log(message)
}
