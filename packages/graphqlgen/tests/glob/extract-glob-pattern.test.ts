import { extractGlobPattern } from '../../src/glob'

/**
 * Walk through all files under a directory
 */
test('Basic Walk', () => {
  const mockPath = './tests/glob/mocks/dir-1/*.ts'
  expect(extractGlobPattern(mockPath)).toMatchObject([
    './tests/glob/mocks/dir-1/file-11.ts',
    './tests/glob/mocks/dir-1/file-12.ts',
  ])
})

/**
 * Walk through all folders under a dir using pattern
 */
test('Wild Walk', () => {
  const mockPath = './tests/glob/mocks/**/*.ts'
  expect(extractGlobPattern(mockPath)).toMatchObject([
    './tests/glob/mocks/dir-1/file-11.ts',
    './tests/glob/mocks/dir-1/file-12.ts',
    './tests/glob/mocks/dir-2/file-21.ts',
    './tests/glob/mocks/dir-2/file-22.ts',
  ])
})

/**
 * If no glob pattern is mentioned, Return the input array
 */
test('No Walk', () => {
  const mockPath = './tests/glob/mocks/dir-1/file-11.ts'
  expect(extractGlobPattern(mockPath)).toMatchObject([mockPath])
})

/**
 * Unknown Path, Returns an empty array
 */
test('Unknown Walk', () => {
  const mockPath = './tests/glob/mocks/dir-3/*.ts'

  expect(extractGlobPattern(mockPath)).toMatchObject([])
})
