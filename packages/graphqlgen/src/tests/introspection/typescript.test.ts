import {
  extractFieldsFromTypescriptType,
  typeNamesFromTypescriptFile
} from "../../introspection/ts-ast";
import { join } from "path";
import { Model } from "../../types";

const relative = (p: string) => join(__dirname, p)

describe('typescript file introspection', () => {
  test('find all types in file', () => {
    const typesNames = typeNamesFromTypescriptFile({ path: relative('./mocks/types.ts') })

    expect(typesNames).toEqual(['Interface', 'Type', 'ExportedInterface', 'ExportedType'])
  })

  test('extract fields from typescript type', () => {
    const model: Model = {
      modelTypeName: 'Interface',
      absoluteFilePath: relative('./mocks/types.ts'),
      importPathRelativeToOutput: 'not_used'
    }
    const fields = extractFieldsFromTypescriptType(model)

    expect(fields).toEqual([
      { fieldName: 'field', fieldOptional: false },
      { fieldName: 'optionalField', fieldOptional: true },
      { fieldName: 'fieldUnionNull', fieldOptional: true },
    ])
  })
})
