import * as Zip from 'adm-zip'
import * as tmp from 'tmp'
import * as github from 'parse-github-url'
import * as fs from 'fs'
import * as ora from 'ora'
import * as request from 'request'
import * as execa from 'execa'
import chalk from 'chalk'

import { Starter } from './starters'

interface LoadOptions {
  installDependencies: boolean
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

  printFinalMessage()
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
  const spinner = ora(`Installing dependencies 📦`).start()
  process.chdir(path)

  if (await isYarnInstalled()) {
    await execa.shellSync('yarnpkg install', { stdio: `inherit` })
  } else {
    await execa.shellSync('npm install', { stdio: `inherit` })
  }

  spinner.succeed()
}

const isYarnInstalled = async () => {
  try {
    await execa.shell(`yarnpkg --version`, { stdio: `ignore` })
    return true
  } catch (err) {
    return false
  }
}

function printFinalMessage() {
  console.log(`

Your ${chalk.blueBright(`GraphQL server`)} has been successfully set up! 🎉
  `)
}
