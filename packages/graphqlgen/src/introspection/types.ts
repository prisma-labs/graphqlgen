import { File } from 'graphqlgen-json-schema'

export type InnerType =
  | ScalarTypeAnnotation
  | UnionTypeAnnotation
  | AnonymousInterfaceAnnotation
  | LiteralTypeAnnotation

export type InternalInnerType = InnerType | TypeReferenceAnnotation

export type UnknownType = '_UNKNOWN_TYPE_'
export type Scalar = 'string' | 'number' | 'boolean' | null

export type TypeDefinition = InterfaceDefinition | TypeAliasDefinition

export type InnerAndTypeDefinition = InnerType | TypeDefinition

type Defer<T> = () => T

interface BaseTypeDefinition {
  name: string
}

export interface InterfaceDefinition extends BaseTypeDefinition {
  kind: 'InterfaceDefinition'
  fields: FieldDefinition[]
}

export interface FieldDefinition {
  name: string
  getType: Defer<InnerAndTypeDefinition>
  optional: boolean
}

export interface TypeAliasDefinition extends BaseTypeDefinition {
  kind: 'TypeAliasDefinition'
  getType: Defer<InnerAndTypeDefinition>
  isEnum: Defer<boolean> //If type is UnionType && `types` are scalar strings
}

export interface UnionTypeAnnotation {
  kind: 'UnionTypeAnnotation'
  getTypes: Defer<InnerAndTypeDefinition[]>
  isArray: boolean
  isEnum: Defer<boolean>
}

export interface ScalarTypeAnnotation {
  kind: 'ScalarTypeAnnotation'
  type: Scalar | UnknownType
  isArray: boolean
}

export interface AnonymousInterfaceAnnotation {
  kind: 'AnonymousInterfaceAnnotation'
  fields: FieldDefinition[]
  isArray: boolean
}

export interface TypeReferenceAnnotation {
  kind: 'TypeReferenceAnnotation'
  referenceType: string
}

export interface LiteralTypeAnnotation {
  kind: 'LiteralTypeAnnotation'
  type: string
  value: string | number | boolean
  isArray: boolean
}

export interface TypesMap {
  [typeName: string]: TypeDefinition
}

export interface FilesToTypesMap {
  [filePath: string]: TypesMap
}

export interface InterfaceNamesToFile {
  [interfaceName: string]: File
}
