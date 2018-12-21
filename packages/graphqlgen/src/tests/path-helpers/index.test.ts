import { getAbsoluteFilePath } from '../../path-helpers'
import { join, resolve } from 'path'
import { normalizeFilePath } from '../../utils'

const relative = (p: string) => join(__dirname, p)
const language = 'typescript'

test('invalid path', () => {
  expect(() =>
    getAbsoluteFilePath(join('../fixtures/type.ts'), language),
  ).toThrow()
})

test('valid path', () => {
  expect(
    getAbsoluteFilePath(join(__dirname, '../fixtures/basic/index.ts'), language)
      .split('/')
      .slice(-4),
  ).toMatchSnapshot()
})

test('valid directory path', () => {
  expect(
    getAbsoluteFilePath(relative('../fixtures/basic/'), language)
      .split('/')
      .slice(-4),
  ).toMatchSnapshot()
})

test('valid directory path without slash', () => {
  expect(
    getAbsoluteFilePath(relative('../fixtures/basic'), language)
      .split('/')
      .slice(-4),
  ).toMatchSnapshot()
})

test('normalizeFilePath()', () => {
  // '/path/to/file.ts' => '/path/to/file.ts'
  expect(normalizeFilePath(relative('./mocks/types.ts'), language)).toEqual(
    resolve(relative('./mocks/types.ts')),
  )

  // '/path/to/file' => '/path/to/file.ts'
  expect(normalizeFilePath(relative('./mocks/types'), language)).toEqual(
    resolve(relative('./mocks/types.ts')),
  )

  // '/path/to/file' => '/path/to/file/index.ts'
  expect(normalizeFilePath(relative('./mocks/dir-1'), language)).toEqual(
    resolve(relative('./mocks/dir-1/index.ts')),
  )

  // '/path/to/file' => '/path/to/file.ts'
  // Even though there is a folder of the same name
  expect(normalizeFilePath(relative('./mocks/dir-2/dir-3'), language)).toEqual(
    resolve(relative('./mocks/dir-2/dir-3.ts')),
  )
})
