import { getAbsoluteFilePath } from '../../path-helpers'
import { join } from 'path'

test('invalid path', () => {
  expect(() => getAbsoluteFilePath(join('../fixtures/type.ts'))).toThrow()
})

test('valid path', () => {
  expect(
    getAbsoluteFilePath(join(__dirname, '../fixtures/basic/index.ts'))
      .split('/')
      .slice(-4),
  ).toMatchSnapshot()
})

test('valid directory path', () => {
  expect(
    getAbsoluteFilePath(join(__dirname, '../fixtures/basic/'))
      .split('/')
      .slice(-4),
  ).toMatchSnapshot()
})

test('valid directory path without slash', () => {
  expect(
    getAbsoluteFilePath(join(__dirname, '../fixtures/basic'))
      .split('/')
      .slice(-4),
  ).toMatchSnapshot()
})
