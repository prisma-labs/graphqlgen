import { extractPath } from '../../glob'

// Expected output
const expectedArr = [
  './src/tests/glob/mocks/dir-1/file-11.ts',
  './src/tests/glob/mocks/dir-1/file-12.ts',
  './src/tests/glob/mocks/dir-2/file-21.ts',
  './src/tests/glob/mocks/dir-2/file-22.ts',
]

/**
 * Walk through all files under a directory
 */
test('Basic Walk', () => {
  const mockPaths = [
    './src/tests/glob/mocks/dir-1/*.ts',
    './src/tests/glob/mocks/dir-2/*.ts',
  ]
  expect(extractPath(mockPaths)).toMatchObject(expectedArr)
})

/**
 * Walk through all folders under a dir using pattern
 */
test('Wild Walk', () => {
  const mockPaths = ['./src/tests/glob/mocks/**/*.ts']
  expect(extractPath(mockPaths)).toMatchObject(expectedArr)
})

/**
 * If no glob pattern is mentioned, Return the input array
 */
test('No Walk', () => {
  const mockPaths = [
    './src/tests/glob/mocks/dir-1/file-11.ts',
    './src/tests/glob/mocks/dir-2/file-21.ts',
  ]
  expect(extractPath(mockPaths)).toMatchObject(mockPaths)
})

/**
 * If no glob pattern is mentioned, Return the input array
 */
test('Mixed Walk', () => {
  const mockPaths = [
    './src/tests/glob/mocks/dir-1/file-11.ts',
    './src/tests/glob/mocks/dir-2/file-21.ts',
    './src/tests/glob/mocks/**/*.ts', // Wild Walk
    './src/tests/glob/mocks/dir-1/*.ts', // Basic Walk
    './src/tests/glob/mocks/dir-2/*.ts', // Basic Walk
  ]
  expect(extractPath(mockPaths)).toMatchObject([
    ...[
      './src/tests/glob/mocks/dir-1/file-11.ts',
      './src/tests/glob/mocks/dir-2/file-21.ts',
    ],
    ...expectedArr,
    ...expectedArr,
  ])
})

/**
 * Unknown Path, Returns an empty array
 */
test('Unknown Walk', () => {
  const mockPaths = ['./src/tests/glob/mocks/dir-3/*.ts']
  expect(extractPath(mockPaths)).toMatchObject([])
})
