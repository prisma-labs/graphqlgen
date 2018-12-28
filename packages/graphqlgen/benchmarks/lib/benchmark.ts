import * as Bench from 'benchmark'

type Report = {
  name: string
  summary: string
  hz: number
  count: number
  cycles: number
  stats: Bench.Stats
}

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

export { Benchmark, Report }
