import * as IntegrationBenchmarks from './integration'
import * as Benchmark from './lib/benchmark'

const reports = IntegrationBenchmarks.collect().reduce<Benchmark.Report[]>(
  (acc, benchmark) => {
    acc.push(benchmark.run())
    return acc
  },
  [],
)

console.log(reports)
