import { join } from 'path'
import { addFileToTypesMap } from '../../introspection'

const relative = (p: string) => join(__dirname, p)
const language = 'flow'

describe('flow file introspection', () => {
  test('find all types in file', () => {
    const typesNames = Object.keys(
      addFileToTypesMap(relative('./mocks/flow-types.js'), language),
    )

    expect(typesNames).toEqual([
      'Interface',
      'Type',
      'ExportedInterface',
      'ExportedType',
    ])
  })
})
