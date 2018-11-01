import { extractGlobPattern } from '../../glob'

/**
 * Walk through all files under a directory
 */
test('Basic Walk', () => {
  const mockPaths = [
    './src/tests/fixtures/glob/dir-1/*.ts',
    './src/tests/fixtures/glob/dir-2/*.ts',
  ]
  expect(extractGlobPattern(mockPaths)).toMatchSnapshot()
})

/**
 * Walk through all folders under a dir using pattern
 */
test('Wild Walk', () => {
  const mockPaths = ['./src/tests/fixtures/glob/**/*.ts']
  expect(extractGlobPattern(mockPaths)).toMatchSnapshot()
})

/**
 * If no glob pattern is mentioned, Return the input array
 */
test('No Walk', () => {
  const mockPaths = [
    './src/tests/fixtures/glob/dir-1/file-11.ts',
    './src/tests/fixtures/glob/dir-2/file-21.ts',
  ]
  expect(extractGlobPattern(mockPaths)).toMatchSnapshot()
})

/**
 * Walk through mixed set of files
 */
test('Mixed Walk', () => {
  const mockPaths = [
    './src/tests/fixtures/glob/dir-1/file-11.ts',
    './src/tests/fixtures/glob/dir-2/file-21.ts',
    './src/tests/fixtures/glob/**/*.ts', // Wild Walk
    './src/tests/fixtures/glob/dir-1/*.ts', // Basic Walk
    './src/tests/fixtures/glob/dir-2/*.ts', // Basic Walk
  ]
  expect(extractGlobPattern(mockPaths)).toMatchSnapshot()
})

/**
 * Unknown Path, Returns an empty array
 */
test('Unknown Walk', () => {
  const mockPaths = ['./src/tests/fixtures/glob/dir-3/*.ts']
  expect(extractGlobPattern(mockPaths)).toMatchObject([])
})
