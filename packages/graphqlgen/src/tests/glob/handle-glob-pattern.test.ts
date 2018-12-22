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
      { path: './src/tests/glob/mocks/**/*.ts', defaultName: '{typeName}Node' },
      { path: 'anotherPath', defaultName: undefined },
    ]),
  ).toMatchObject([
    {
      path: './src/tests/glob/mocks/dir-1/file-11.ts',
      defaultName: '{typeName}Node',
    },
    {
      path: './src/tests/glob/mocks/dir-1/file-12.ts',
      defaultName: '{typeName}Node',
    },
    {
      path: './src/tests/glob/mocks/dir-2/file-21.ts',
      defaultName: '{typeName}Node',
    },
    {
      path: './src/tests/glob/mocks/dir-2/file-22.ts',
      defaultName: '{typeName}Node',
    },
    { path: 'anotherPath', defaultName: undefined },
  ])
})

/**
 * Test the glob pattern handling of Files[] with duplicates
 */
test('Handle Complex Walk', () => {
  expect(
    handleGlobPattern([
      { path: './src/tests/glob/mocks/**/*.ts', defaultName: '{typeName}Node' },
      {
        path: './src/tests/glob/mocks/dir-1/file-11.ts',
        defaultName: undefined,
      },
      { path: 'anotherPath', defaultName: undefined },
    ]),
  ).toMatchObject([
    {
      path: './src/tests/glob/mocks/dir-1/file-11.ts',
      defaultName: '{typeName}Node',
    },
    {
      path: './src/tests/glob/mocks/dir-1/file-12.ts',
      defaultName: '{typeName}Node',
    },
    {
      path: './src/tests/glob/mocks/dir-2/file-21.ts',
      defaultName: '{typeName}Node',
    },
    {
      path: './src/tests/glob/mocks/dir-2/file-22.ts',
      defaultName: '{typeName}Node',
    },
    { path: './src/tests/glob/mocks/dir-1/file-11.ts', defaultName: undefined },
    { path: 'anotherPath', defaultName: undefined },
  ])
})
