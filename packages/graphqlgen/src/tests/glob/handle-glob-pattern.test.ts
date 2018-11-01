import { handleGlobPattern } from '../../glob'

/**
 * Test the glob pattern handling of Files[] : Basic
 */
test('Handle Basic Walk', () => {
  expect(
    handleGlobPattern([
      './src/tests/glob/mocks/dir-1/*.ts',
      { path: 'somepath', defaultName: undefined },
      { path: 'anotherPath', defaultName: undefined },
    ]),
  ).toMatchObject([
    './src/tests/glob/mocks/dir-1/file-11.ts',
    './src/tests/glob/mocks/dir-1/file-12.ts',
    { path: 'somepath', defaultName: undefined },
    { path: 'anotherPath', defaultName: undefined },
  ])
})

/**
 * Test the glob pattern handling of Files[] : Complex
 */
test('Handle Complex Walk', () => {
  expect(
    handleGlobPattern([
      './src/tests/glob/mocks/**/*.ts',
      { path: 'somepath', defaultName: undefined },
      { path: 'anotherPath', defaultName: undefined },
    ]),
  ).toMatchObject([
    './src/tests/glob/mocks/dir-1/file-11.ts',
    './src/tests/glob/mocks/dir-1/file-12.ts',
    './src/tests/glob/mocks/dir-2/file-21.ts',
    './src/tests/glob/mocks/dir-2/file-22.ts',
    { path: 'somepath', defaultName: undefined },
    { path: 'anotherPath', defaultName: undefined },
  ])
})
