import * as Zip from 'adm-zip'
import * as github from 'parse-github-url'
import * as tmp from 'tmp'
import * as fs from 'fs'
import * as rimraf from 'rimraf'
import * as request from 'request'
import * as execa from 'execa'

interface StarterOptions {
  repo: string
  outputDir: string
}

export function loadGraphQLGenStarter(starter: StarterOptions): void {
  const uri = getStarterURI(starter.repo)
}

function getStarterURI(starter: string): string | null {
  const meta = github(starter)

  if (meta.host && meta.owner && meta.repo && meta.branch) {
    return `https://${meta.host}/${meta.owner}/tree/${meta.branch}`
  } else if (meta.host && meta.owner && meta.repo) {
    return `https://${meta.host}/${meta.owner}`
  } else {
    return null
  }
}

async function downloadRepositoryTo(
  repo: RepoZipInformation,
  outputDir: string,
): Promise<string> {
  const { url } = repo
  const tmpPath = tmp.fileSync()

  await new Promise(resolve => {
    request(url)
      .pipe(fs.createWriteStream(tmpPath.name))
      .on('close', resolve)
  })

  const zip = new Zip(tmpPath.name)
  zip.extractEntryTo(repo.path, outputDir, false)
  tmpPath.removeCallback()

  return 
  
function installStarterDependencies() {
  const yarnExists: boolean = cmdExists('yarn')

  if (yarnExists) {

  }

}

export interface RepoZipInformation {
  url: string
  path: string
}

function getRepoZipInformation(starter: string): RepoZipInformation | null {
  const meta = github(starter)

  let baseUrl = ''
  let branch = 'master'
  let subDir = ''

  const branchMatches = ''.match(/^(.*)\/tree\/([a-zA-Z-_0-9]*)\/?(.*)$/)
  if (branchMatches) {
    baseUrl = branchMatches[1]
    branch = branchMatches[2]
    subDir = branchMatches[3]
  }

  if (subDir === undefined) {
    subDir = ''
  }

  if (!subDir.startsWith('/')) {
    subDir = '/' + subDir
  }
  if (!subDir.endsWith('/')) {
    subDir = subDir + '/'
  }

  const nameMatches = baseUrl.match(/github\.com\/(.*)\/(.*)$/)
  const repoName = nameMatches![2]

  const url = `${baseUrl}/archive/${branch}.zip`
  const path = `${repoName}-${branch}${subDir}`

  return { url, path }
}
