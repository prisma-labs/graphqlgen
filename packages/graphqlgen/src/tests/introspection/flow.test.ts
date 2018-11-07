import { join } from 'path'
import { buildTypesMap } from '../../introspection'

const relative = (p: string) => join(__dirname, p)
const language = 'flow'

describe('flow file introspection', () => {
  test('find all types in file', () => {
    const typesNames = Object.keys(
      buildTypesMap(relative('./mocks/flow-types.js'), language),
    )

    expect(typesNames).toEqual([
      'Interface',
      'Type',
      'ExportedInterface',
      'ExportedType',
    ])
  })
})
