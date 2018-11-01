import { handleGlobPattern } from '../../glob'

/**
 * Test the glob pattern handling of Files[] : Basic
 */
test('Handle Basic Walk', () => {
  expect(
    handleGlobPattern([
      { path: 'anotherPath', defaultName: undefined },
      './src/tests/fixtures/glob/dir-1/*.ts',
      { path: 'somepath', defaultName: undefined },
    ]),
  ).toMatchSnapshot()
})

/**
 * Test the glob pattern handling of Files[] : Complex
 */
test('Handle Complex Walk', () => {
  expect(
    handleGlobPattern([
      { path: 'somepath', defaultName: undefined },
      './src/tests/fixtures/glob/**/*.ts',
      { path: 'anotherPath', defaultName: undefined },
    ]),
  ).toMatchSnapshot()
})
