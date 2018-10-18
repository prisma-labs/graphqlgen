import { getAbsoluteFilePath } from '../../path-helpers'
import { join } from 'path'

const language = 'typescript'

test('invalid path', () => {
  expect(() => getAbsoluteFilePath(join('../fixtures/type.ts'), language)).toThrow()
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
    getAbsoluteFilePath(join(__dirname, '../fixtures/basic/'), language)
      .split('/')
      .slice(-4),
  ).toMatchSnapshot()
})

test('valid directory path without slash', () => {
  expect(
    getAbsoluteFilePath(join(__dirname, '../fixtures/basic'), language)
      .split('/')
      .slice(-4),
  ).toMatchSnapshot()
})
