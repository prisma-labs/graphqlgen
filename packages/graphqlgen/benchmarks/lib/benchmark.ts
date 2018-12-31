import * as Bench from 'benchmark'
import * as H from '../lib/helpers'

type History = Record<string, Report[]>

/**
 * Benchmark performance results
 *
 *  * hz: The number of executions per second.
 *  * count: The number of times a test was executed.
 *  * cycles: The number of cycles performed while benchmarking.
 *  * stats.deviation: The sample standard deviation.
 *  * stats.mean: The sample arithmetic mean (secs).
 *  * stats.moe: The margin of error.
 *  * stats.rme: The relative margin of error (expressed as a percentage of the mean).
 *  * stats.sample: The array of sampled periods.
 *  * stats.sem: The standard error of the mean.
 *  * stats.variance: The sample variance.
 *
 * To get more detail refer to:
 *
 *  * https://stackoverflow.com/questions/32629779/define-number-of-cycles-benchmark-js
 *  * http://monsur.hossa.in/2012/12/11/benchmarkjs.html
 */
type Report = {
  name: string
  summary: string
  hz: number
  count: number
  cycles: number
  stats: Bench.Stats
}

/**
 * Function that will collect benchmarks of a benchmark type.
 */
type Collect = () => Benchmark[]

class Benchmark {
  runner: Bench
  name: string

  constructor({ name, test }: { name: string; test: Function }) {
    this.runner = new Bench({ name, fn: test })
    this.name = name
  }

  run = (): Report => {
    this.runner.run()

    const report = {
      name: this.name,
      summary: this.runner.toString(),
      hz: this.runner.hz,
      count: this.runner.count,
      cycles: this.runner.cycles,
      stats: this.runner.stats,
    }

    return report
  }
}

/**
 * Save results of benchmarks to a json file. Provided path must point to a
 * JSON file. File must at least contain the seed.
 */
const saveReports = (path: string, reports: Report[]): void => {
  H.updateJSONFile<History>(path, history => {
    history[H.getGitHeadSha()] = reports
    return history
  })
}

export { Report, Benchmark, saveReports, Collect }
