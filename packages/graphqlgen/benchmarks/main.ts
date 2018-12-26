import * as Scenario from './lib/scenario'
import * as Path from 'path'
import * as Sys from './lib/sys'

const benchmarks = Sys.globRelativeFromHere('./scenarios/*')
  .filter(node => Path.extname(node) === '')
  .map(path => {
    Scenario.validateFixtures(path)
    return path
  })
  .map(path =>
    Scenario.createBenchmark({
      language: 'typescript',
      rootPath: path,
      name: `generateCode (${Path.basename(path)} input)`,
    }),
  )

for (const benchmark of benchmarks) {
  benchmark.run()
  console.log(benchmark.toString())
}
