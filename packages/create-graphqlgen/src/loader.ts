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
    return installGraphQLGenStarter(output)
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
  const path = `${meta.name}-${normalizedBranch}/${starter.repo.path}/`

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

async function extractGraphQLGenStarterFromRepository(
  tmp: string,
  repo: StarterRepositoryZipInformation,
  output: string,
): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const zip = new Zip(tmp)
      const extract = zip.extractEntryTo(repo.path, output, false)

      resolve(extract)
    } catch (err) {
      reject(err)
    }
  })
}

async function installGraphQLGenStarter(path: string): Promise<any> {
  process.chdir(path)

  try {
    await execa(`yarnpkg`, [`--version`], { stdio: `ignore` })
    return execa('yarnpkg')
  } catch (err) {
    return execa('npm install')
  }
}
