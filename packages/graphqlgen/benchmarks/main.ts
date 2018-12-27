import * as IntegrationBenchmarks from './integration'

const benchmarks = IntegrationBenchmarks.collect()

for (const benchmark of benchmarks) {
  benchmark.run()
  console.log(benchmark.toString())
}
