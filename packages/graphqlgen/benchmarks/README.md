# Benchmarks

- Results can be reviewed in [history.json](https://github.com/prisma/graphqlgen/blob/master/packages/graphqlgen/benchmarks/history.json)
- Run benchmarks within that package via `yarn run benchmarks`
- Save results via `yarn run benchmarks --save`

### Folder Structure

```
/benchmarks
  history.json  <-- file keeping results of past benchmark runs
  index.ts      <-- benchmark execution entrypoint
  /lib/*        <-- base tools/types/logic for benchmark system
  /integration  <-- integration-type benchmarks testing how quickly code-generation runs
    index.ts    <-- integration-type benchmarks entrypoint (creates & collects benchmarks)
    /a          <-- integration-type benchmark for a particular set of fixtures
      model.ts
      schema.graphql
    /b/*
    /c/*
```

### Developer Guide

#### Adding a new integration-type benchmark

1. Create a new folder for your benchmark case:

   ```
   /benchmarks
     /integration
       /<YOUR-BENCHMARK-TITLE-HERE>
   ```

2. Add fixtures containing whatever data case/pattern you're interested in benching:

   ```
   model.ts
   schema.graphql
   ```

#### Adding a new type of benchmark

1. Create a new folder for your benchmark type:

   ```
   /benchmarks
     /<YOUR-BENCHMARK-TYPE-TITLE-HERE>
   ```

2. Implement an `index.ts` that exports a `collect` function:

   ```
   /benchmarks
     /<YOUR-BENCHMARK-TYPE-TITLE-HERE>
       index.ts
   ```

   ```ts
   import * as Benchmark from '../lib/benchmark'

   const collect: Benchmark.Collect = () => {
     // TODO
   }

   export { collect }
   ```

   The collect function is responsible for returning benchmarks from your benchmark type to run. Some guidelines to keep in mind:

   1. Adding new benchmarks to this type should be trivial, therefore, should only require the addition of fixtures and/or benchmark-specific code. For example the benchmark type should be prepared to pick up new folders automatically.

   2. Support all types of languages supported by graphqlgen

   With your system in place, add benchmarks as needed, in the format your collector dictates:

   ```
   /benchmarks
     /<YOUR-BENCHMARK-TYPE-TITLE-HERE>
       index.ts
       ...  <-- dictated by your collector
   ```
