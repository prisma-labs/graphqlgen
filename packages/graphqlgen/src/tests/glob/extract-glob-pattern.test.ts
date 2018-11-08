import { extractGlobPattern } from '../../glob'

/**
 * Walk through all files under a directory
 */
test('Basic Walk', () => {
  const mockPath = './src/tests/glob/mocks/dir-1/*.ts'
  expect(extractGlobPattern(mockPath)).toMatchObject([
    './src/tests/glob/mocks/dir-1/file-11.ts',
    './src/tests/glob/mocks/dir-1/file-12.ts',
  ])
})

/**
 * Walk through all folders under a dir using pattern
 */
test('Wild Walk', () => {
  const mockPath = './src/tests/glob/mocks/**/*.ts'
  expect(extractGlobPattern(mockPath)).toMatchObject([
    './src/tests/glob/mocks/dir-1/file-11.ts',
    './src/tests/glob/mocks/dir-1/file-12.ts',
    './src/tests/glob/mocks/dir-2/file-21.ts',
    './src/tests/glob/mocks/dir-2/file-22.ts',
  ])
})

/**
 * If no glob pattern is mentioned, Return the input array
 */
test('No Walk', () => {
  const mockPath = './src/tests/glob/mocks/dir-1/file-11.ts'
  expect(extractGlobPattern(mockPath)).toMatchObject([mockPath])
})

/**
 * Unknown Path, Returns an empty array
 */
test('Unknown Walk', () => {
  const mockPath = './src/tests/glob/mocks/dir-3/*.ts'

  expect(extractGlobPattern(mockPath)).toMatchObject([])
})
