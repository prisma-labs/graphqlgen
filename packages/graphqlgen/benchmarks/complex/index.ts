import * as Scenario from '../lib/scenario'

const run = () => {
  const benchmark = Scenario.createBenchmark({ language: 'typescript' })
  benchmark.run()
  console.log(benchmark.toString())
}

export { run }
