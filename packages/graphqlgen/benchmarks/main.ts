import * as IntegrationBenchmarks from './integration'
import * as Benchmark from './lib/benchmark'
import * as yargs from 'yargs'
import * as FS from 'fs'
import * as Path from 'path'
import * as CP from 'child_process'

type History = Record<string, Benchmark.Report[]>

const printReports = (reports: Benchmark.Report[]): void => {
  for (const report of reports) {
    console.log(report.summary)
  }
}

const getGitHeadSha = (): string => {
  return CP.execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
}

const updateJSONFile = <T extends unknown>(
  path: string,
  updater: (data: T) => T,
): void => {
  const data: T = JSON.parse(
    FS.readFileSync(Path.join(__dirname, './history.json'), 'utf8'),
  )
  const updatedData = updater(data)
  FS.writeFileSync(path, JSON.stringify(updatedData, null, 2))
}

const argv = yargs
  .usage('bench [args]')
  .option('save', {
    alias: 's',
    default: false,
    describe: 'append benchmark results to benchmark history file',
  })
  .version(false)
  .help().argv

const reports = IntegrationBenchmarks.collect().reduce<Benchmark.Report[]>(
  (acc, benchmark) => {
    acc.push(benchmark.run())
    return acc
  },
  [],
)

if (argv.save) {
  updateJSONFile<History>(Path.join(__dirname, './history.json'), history => {
    history[getGitHeadSha()] = reports
    return history
  })
  printReports(reports)
} else {
  printReports(reports)
}
