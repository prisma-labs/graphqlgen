import { join } from 'path'
import { buildTypesMap } from '../../introspection/ts-ast'

const relative = (p: string) => join(__dirname, p)

describe('typescript file introspection', () => {
  test('find all types in file', () => {
    const typesNames = Object.keys(buildTypesMap(relative('./mocks/types.ts')))

    expect(typesNames).toEqual([
      'Interface',
      'Type',
      'ExportedInterface',
      'ExportedType',
    ])
  })

  // TODO: Update test
  // test('extract fields from typescript type', () => {
  //   const model: Model = { modelTypeName: 'Interface', absoluteFilePath: relative('./mocks/types.ts'), importPathRelativeToOutput: 'not_used' }
  //   const fields = extractFieldsFromTypescriptType(model)
  //
  //   expect(fields).toEqual([
  //     { fieldName: 'field', fieldOptional: false },
  //     { fieldName: 'optionalField', fieldOptional: true },
  //     { fieldName: 'fieldUnionNull', fieldOptional: true },
  //   ])
  // })
})
