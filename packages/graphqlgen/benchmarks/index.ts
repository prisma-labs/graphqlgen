import * as Benchmark from './lib/benchmark'
import * as IntegrationBenchmarks from './integration'
import * as MicroBenchmarks from './micro'
import * as yargs from 'yargs'
import * as Path from 'path'

const argv = yargs
  .usage('bench [args]')
  .option('save', {
    alias: 's',
    default: false,
    describe: 'append benchmark results to benchmark history file',
    type: 'boolean',
  })
  .options('filter', {
    alias: 'f',
    default: '',
    describe: 'only run matching benchmarks',
    type: 'string',
  })
  .version(false)
  .help().argv

const pattern = argv.filter ? new RegExp(argv.filter) : null

const filterer = pattern
  ? (b: Benchmark.Benchmark) => {
      return b.name.match(pattern)
    }
  : () => true

const reports = [
  ...MicroBenchmarks.collect(),
  ...IntegrationBenchmarks.collect(),
]
  .filter(filterer)
  .reduce<Benchmark.Report[]>((acc, benchmark) => {
    acc.push(benchmark.run())
    return acc
  }, [])

if (argv.save) {
  Benchmark.saveReports(Path.join(__dirname, './history.json'), reports)
  reports.forEach(report => console.log(report.summary))
} else {
  reports.forEach(report => console.log(report.summary))
}
