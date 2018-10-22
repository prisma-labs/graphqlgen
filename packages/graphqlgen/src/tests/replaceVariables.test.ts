import { replaceVariablesInString } from '../parse'

describe('replaceVariablesInString', () => {
  test('basic usage', () => {
    const replacements = {
      typeName: 'User',
    }
    expect(replaceVariablesInString('${typeName}Node', replacements)).toBe(
      'UserNode',
    )
  })
  test('allow repititions of variables', () => {
    const replacements = {
      typeName: 'User',
    }
    expect(
      replaceVariablesInString('${typeName}Node${typeName}', replacements),
    ).toBe('UserNodeUser')
  })
  test('throw for missing variable', () => {
    const replacements = {
      typeNa: 'User',
    }
    expect(() =>
      replaceVariablesInString('${typeName}Node', replacements),
    ).toThrow()
  })
})
