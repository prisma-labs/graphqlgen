import {
  InternalInnerType,
  TypeAliasDefinition,
  FieldDefinition,
  InterfaceDefinition,
  Scalar,
  ScalarTypeAnnotation,
  UnionTypeAnnotation,
  AnonymousInterfaceAnnotation,
  LiteralTypeAnnotation,
  TypeReferenceAnnotation,
  UnknownType,
} from './types'
import { buildTypeGetter, isEnumUnion } from './utils'
import { filesToTypesMap } from './index'

export function createTypeAlias(
  name: string,
  type: InternalInnerType,
  filePath: string,
): TypeAliasDefinition {
  return {
    kind: 'TypeAliasDefinition',
    name,
    getType: buildTypeGetter(type, filePath),
    isEnum: () => {
      return type.kind === 'UnionTypeAnnotation' && isEnumUnion(type.getTypes())
    },
  }
}
export function createInterfaceField(
  name: string,
  type: InternalInnerType,
  filePath: string,
  optional: boolean,
): FieldDefinition {
  return {
    name,
    getType: buildTypeGetter(type, filePath),
    optional,
  }
}
export function createInterface(
  name: string,
  fields: FieldDefinition[],
): InterfaceDefinition {
  return {
    kind: 'InterfaceDefinition',
    name,
    fields,
  }
}

interface TypeAnnotationOpts {
  isArray?: boolean
  isTypeRef?: boolean
  isAny?: boolean
}
export function createTypeAnnotation(
  type: Scalar | UnknownType,
  options?: TypeAnnotationOpts,
): ScalarTypeAnnotation {
  let opts: TypeAnnotationOpts = {}
  if (options === undefined) {
    opts = { isArray: false, isTypeRef: false, isAny: false }
  } else {
    opts = {
      isArray: options.isArray === undefined ? false : options.isArray,
      isAny: options.isAny === undefined ? false : options.isAny,
    }
  }

  const isArray = opts.isArray === undefined ? false : opts.isArray

  return {
    kind: 'ScalarTypeAnnotation',
    type,
    isArray,
  }
}
export function createUnionTypeAnnotation(
  types: InternalInnerType[],
  filePath: string,
): UnionTypeAnnotation {
  const getTypes = () => {
    return types.map(unionType => {
      return unionType.kind === 'TypeReferenceAnnotation'
        ? filesToTypesMap[filePath][unionType.referenceType]
        : unionType
    })
  }

  return {
    kind: 'UnionTypeAnnotation',
    getTypes,
    isArray: false,
    isEnum: () => isEnumUnion(getTypes()),
  }
}
export function createAnonymousInterfaceAnnotation(
  fields: FieldDefinition[],
  isArray: boolean = false,
): AnonymousInterfaceAnnotation {
  return {
    kind: 'AnonymousInterfaceAnnotation',
    fields,
    isArray,
  }
}
export function createLiteralTypeAnnotation(
  type: string,
  value: string | number | boolean,
  isArray: boolean = false,
): LiteralTypeAnnotation {
  return {
    kind: 'LiteralTypeAnnotation',
    type,
    value,
    isArray,
  }
}
export function createTypeReferenceAnnotation(
  referenceType: string,
): TypeReferenceAnnotation {
  return { kind: 'TypeReferenceAnnotation', referenceType }
}
