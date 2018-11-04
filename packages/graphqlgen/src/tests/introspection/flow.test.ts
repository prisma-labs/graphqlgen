import { join } from 'path'
import { typeNamesFromFlowFile } from '../../introspection/flow-ast'

const relative = (p: string) => join(__dirname, p)

describe('flow file introspection', () => {
  test('find all types in file', () => {
    const typesNames = typeNamesFromFlowFile({
      path: relative('./mocks/flow-types.js'),
    })

    expect(typesNames).toEqual([
      'Interface',
      'Type',
      'ExportedInterface',
      'ExportedType',
    ])
  })

  // test('extract fields from flow type', () => {
  //   const model: Model = {
  //     definition: 'Interface',
  //     absoluteFilePath: relative('./mocks/flow-types.js'),
  //     importPathRelativeToOutput: 'not_used'
  //   }
  //   const fields = extractFieldsFromFlowType(model)

  //   expect(fields).toEqual([
  //     { fieldName: 'field', fieldOptional: false },
  //     { fieldName: 'optionalField', fieldOptional: true },
  //     { fieldName: 'fieldUnionNull', fieldOptional: true },
  //   ])
  // })
})
