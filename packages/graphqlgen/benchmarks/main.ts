import * as Scenario from './integration'
import * as Path from 'path'
import * as Util from '../src/utils'
import * as Bench from 'benchmark'
import * as Glob from 'glob'

const collectBenchmarks = (paths: string[]): Bench[] => {
  const benchmarks: Bench[] = []

  for (const path of paths) {
    if (Util.isFile(path)) continue

    Scenario.validateFixtures(path)

    const modelPaths = Glob.sync(Path.join(path, './models.*'))

    for (const modelPath of modelPaths) {
      // 1. We know there will be an extension because of isFile
      // filter above. 2. We know it will be a support language extension
      // because of the filter right after.
      const ext = Util.getExt(modelPath) as Util.LanguageExtension

      if (!Util.languageExtensions.includes(ext)) continue

      const benchmark = Scenario.createBenchmark({
        language: Util.getLangFromExt(ext),
        rootPath: path,
      })

      benchmarks.push(benchmark)
    }
  }

  return benchmarks
}

const paths = Glob.sync(Path.join(__dirname, './integration/*'))
const benchmarks = collectBenchmarks(paths)

for (const benchmark of benchmarks) {
  benchmark.run()
  console.log(benchmark.toString())
}
