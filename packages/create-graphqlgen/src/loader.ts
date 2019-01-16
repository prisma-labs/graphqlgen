import * as tar from 'tar'
import * as tmp from 'tmp'
import * as github from 'parse-github-url'
import * as fs from 'fs'
import * as ora from 'ora'
import * as request from 'request'
import * as execa from 'execa'
import chalk from 'chalk'
import { Template } from './templates'

interface LoadOptions {
  installDependencies: boolean
  generateModels: boolean
}

const loadGraphQLGenStarter = async (
  template: Template,
  output: string,
  options: LoadOptions,
): Promise<void> => {
  const tar = getGraphQLGenTemplateRepositoryTarInformation(template)
  const tmp = await downloadRepository(tar)

  await extractGraphQLGenStarterFromRepository(tmp, tar, output)

  if (options.installDependencies) {
    await installGraphQLGenStarter(output)
  }

  if (options.generateModels) {
    await generateGraphQLGenStarterModels(output)
  }

  printHelpMessage()
}

interface TemplateRepositoryTarInformation {
  uri: string
  files: string
}

const getGraphQLGenTemplateRepositoryTarInformation = (
  template: Template,
): TemplateRepositoryTarInformation => {
  const meta = github(template.repo.uri)

  const uri = [
    `https://api.github.com/repos`,
    meta.repo,
    'tarball',
    template.repo.branch,
  ].join('/')

  return { uri, files: template.repo.path }
}

const downloadRepository = async (
  tar: TemplateRepositoryTarInformation,
): Promise<string> => {
  const spinner = ora(`Downloading starter from ${chalk.cyan(tar.uri)}`).start()

  const tmpPath = tmp.fileSync({
    postfix: '.tar.gz',
  })

  await new Promise(resolve => {
    request(tar.uri, {
      headers: {
        'User-Agent': 'prisma/create-graphqlgen',
      },
    })
      .pipe(fs.createWriteStream(tmpPath.name))
      .on('close', resolve)
  })

  spinner.succeed()

  return tmpPath.name
}

const extractGraphQLGenStarterFromRepository = async (
  tmp: string,
  repo: TemplateRepositoryTarInformation,
  output: string,
): Promise<void> => {
  const spinner = ora(`Extracting content to ${chalk.cyan(output)}`)

  await tar.extract({
    file: tmp,
    cwd: output,
    filter: path => RegExp(repo.files).test(path),
    strip: repo.files.split('/').length,
  })

  spinner.succeed()

  return
}

const installGraphQLGenStarter = async (path: string): Promise<void> => {
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

const generateGraphQLGenStarterModels = async (path: string): Promise<void> => {
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

const isYarnInstalled = async (): Promise<boolean> => {
  try {
    await execa.shell(`yarnpkg --version`, { stdio: `ignore` })
    return true
  } catch (err) {
    return false
  }
}

const printHelpMessage = (): void => {
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

export { LoadOptions, loadGraphQLGenStarter }
