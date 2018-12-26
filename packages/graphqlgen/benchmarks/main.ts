import * as Scenario from './lib/scenario'
import * as Path from 'path'
import * as Sys from './lib/sys'

const benchmarks = Sys.globRelativeFromHere('./scenarios/*')
  .filter(node => Path.extname(node) === '')
  .map(path =>
    Scenario.createBenchmark({
      language: 'typescript',
      rootPath: path,
      name: Path.basename(path),
    }),
  )

for (const benchmark of benchmarks) {
  benchmark.run()
  console.log(benchmark.toString())
}
