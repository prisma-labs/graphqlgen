import { getAbsoluteFilePath } from '../../path-helpers'
import { join } from 'path'

test('invalid path', () => {
  expect(() => getAbsoluteFilePath(join('../fixtures/type.ts'))).toThrow()
})

test('valid path', () => {
  expect(
    getAbsoluteFilePath(join(__dirname, '../fixtures/basic/types.ts'))
      .split('/')
      .slice(-4),
  ).toMatchSnapshot()
})
