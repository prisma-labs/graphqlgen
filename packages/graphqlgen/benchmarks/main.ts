import * as Benchmark from './lib/benchmark'
import * as IntegrationBenchmarks from './integration'
import * as yargs from 'yargs'
import * as Path from 'path'

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
  Benchmark.saveReports(Path.join(__dirname, './history.json'), reports)
  reports.forEach(report => console.log(report.summary))
} else {
  reports.forEach(report => console.log(report.summary))
}
