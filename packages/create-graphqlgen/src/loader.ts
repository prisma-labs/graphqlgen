import * as Zip from 'adm-zip'
import * as tmp from 'tmp'
import * as github from 'parse-github-url'
import * as fs from 'fs'
import * as request from 'request'
import * as execa from 'execa'

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
    return installGraphQLGenStarter()
  } else {
    return
  }
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
  const path = `${meta.name}-${normalizedBranch}/${starter.repo.path}`

  return { uri, path }
}

async function downloadRepository(
  zip: StarterRepositoryZipInformation,
): Promise<string> {
  const tmpPath = tmp.fileSync()

  await new Promise(resolve => {
    request(zip.uri)
      .pipe(fs.createWriteStream(tmpPath.name))
      .on('close', resolve)
  })

  return tmpPath.name
}

function extractGraphQLGenStarterFromRepository(
  tmp: string,
  repo: StarterRepositoryZipInformation,
  output: string,
): boolean {
  const zip = new Zip(tmp)
  const extract = zip.extractEntryTo(repo.path, output, false, true)

  return extract
}

async function installGraphQLGenStarter(): Promise<any> {
  try {
    await execa(`yarnpkg`, [`--version`], { stdio: `ignore` })
    return execa('yarnpkg')
  } catch (err) {
    return execa('npm install')
  }
}
