import * as fs from 'fs'
import { File } from 'graphqlgen-json-schema'
import { buildFilesToTypesMap } from '../parse'
import { parse as parseTS } from '@babel/parser'
import {
  ExportNamedDeclaration,
  File as TSFile,
  Identifier,
  isTSArrayType,
  isTSBooleanKeyword,
  isTSLiteralType,
  isTSNumberKeyword,
  isTSPropertySignature,
  isTSStringKeyword,
  isTSTypeReference,
  isTSUnionType,
  Statement,
  TSInterfaceDeclaration,
  TSPropertySignature,
  TSType,
  TSTypeAliasDeclaration,
  TSUnionType,
  isTSAnyKeyword,
  isTSNullKeyword,
  isTSUndefinedKeyword,
  isTSTypeLiteral,
  TSTypeElement,
  BaseNode,
  isTSParenthesizedType,
} from '@babel/types'
import chalk from 'chalk'

type InnerType =
  | ScalarTypeAnnotation
  | UnionTypeAnnotation
  | AnonymousInterfaceAnnotation
  | LiteralTypeAnnotation

type InternalInnerType = InnerType | TypeReferenceAnnotation

type UnknownType = '_UNKNOWN_TYPE_'
type Scalar = 'string' | 'number' | 'boolean' | null | UnknownType

export type TypeDefinition = InterfaceDefinition | TypeAliasDefinition

export type InnerAndTypeDefinition = InnerType | TypeDefinition

// /!\ If you add a supported type of field, make sure you update isSupportedField() as well
type SupportedFields = TSPropertySignature

export interface UnionTypeAnnotation {
  kind: 'UnionTypeAnnotation'
  getTypes: Defer<InnerAndTypeDefinition[]>
  isArray: boolean
  isEnum: Defer<boolean>
}

interface ScalarTypeAnnotation {
  kind: 'ScalarTypeAnnotation'
  type: Scalar
  isArray: boolean
}

export interface AnonymousInterfaceAnnotation {
  kind: 'AnonymousInterfaceAnnotation'
  fields: FieldDefinition[]
  isArray: boolean
}

interface TypeReferenceAnnotation {
  kind: 'TypeReferenceAnnotation'
  referenceType: string
}

interface LiteralTypeAnnotation {
  kind: 'LiteralTypeAnnotation'
  type: string
  value: string | number | boolean
  isArray: boolean
}

type Defer<T> = () => T

interface BaseTypeDefinition {
  name: string
}

export interface FieldDefinition {
  name: string
  getType: Defer<InnerAndTypeDefinition>
  optional: boolean
}

export interface InterfaceDefinition extends BaseTypeDefinition {
  kind: 'InterfaceDefinition'
  fields: FieldDefinition[]
}

export interface TypeAliasDefinition extends BaseTypeDefinition {
  kind: 'TypeAliasDefinition'
  getType: Defer<InnerAndTypeDefinition>
  isEnum: Defer<boolean> //If type is UnionType && `types` are scalar strings
}

export interface TypesMap {
  [typeName: string]: TypeDefinition
}

export interface InterfaceNamesToFile {
  [interfaceName: string]: File
}

export interface ModelField {
  fieldName: string
  fieldOptional: boolean
}

type ExtractableType = TSTypeAliasDeclaration | TSInterfaceDeclaration

const filesToTypesMap: { [filePath: string]: TypesMap } = {}

function buildTypeGetter(
  type: InternalInnerType,
  filePath: string,
): () => InnerAndTypeDefinition {
  if (type.kind === 'TypeReferenceAnnotation') {
    return () => filesToTypesMap[filePath][type.referenceType]
  } else {
    return () => type
  }
}

export function isFieldDefinitionEnumOrLiteral(
  modelFieldType: InnerAndTypeDefinition,
): boolean {
  // If type is: 'value'
  if (isLiteralString(modelFieldType)) {
    return true
  }

  if (
    modelFieldType.kind === 'UnionTypeAnnotation' &&
    modelFieldType.isEnum()
  ) {
    return true
  }

  // If type is: type X = 'value'
  if (
    modelFieldType.kind === 'TypeAliasDefinition' &&
    isLiteralString(modelFieldType.getType())
  ) {
    return true
  }

  // If type is: Type X = 'value' | 'value2'
  return (
    modelFieldType.kind === 'TypeAliasDefinition' && modelFieldType.isEnum()
  )
}

function isLiteralString(type: InnerAndTypeDefinition) {
  return type.kind === 'LiteralTypeAnnotation' && type.type === 'string'
}

export function getEnumValues(type: InnerAndTypeDefinition): string[] {
  // If type is: 'value'
  if (isLiteralString(type)) {
    return [(type as LiteralTypeAnnotation).value as string]
  }

  if (
    type.kind === 'TypeAliasDefinition' &&
    isLiteralString(type.getType())
  ) {
    return [(type.getType() as LiteralTypeAnnotation).value as string]
  }

  let unionTypes: InnerAndTypeDefinition[] = []

  if (type.kind === 'TypeAliasDefinition' && type.isEnum()) {
    unionTypes = (type.getType() as UnionTypeAnnotation).getTypes()
  } else if (type.kind === 'UnionTypeAnnotation' && type.isEnum) {
    unionTypes = type.getTypes()
  } else {
    return []
  }

  return unionTypes.map(unionType => {
    return (unionType as LiteralTypeAnnotation).value
  }) as string[]
}

function isEnumUnion(unionTypes: InnerAndTypeDefinition[]) {
  return unionTypes.every(unionType => {
    return (
      unionType.kind === 'LiteralTypeAnnotation' &&
      unionType.isArray === false &&
      unionType.type === 'string'
    )
  })
}

function createTypeAlias(
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

function createInterfaceField(
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

function createInterface(
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

function createTypeAnnotation(
  type: Scalar,
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

function createUnionTypeAnnotation(
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

function createAnonymousInterfaceAnnotation(
  fields: FieldDefinition[],
  isArray: boolean = false,
): AnonymousInterfaceAnnotation {
  return {
    kind: 'AnonymousInterfaceAnnotation',
    fields,
    isArray,
  }
}

function createLiteralTypeAnnotation(
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

function createTypeReferenceAnnotation(
  referenceType: string,
): TypeReferenceAnnotation {
  return { kind: 'TypeReferenceAnnotation', referenceType }
}

function computeType(node: TSType, filePath: string): InternalInnerType {
  if (isTSParenthesizedType(node)) {
    node = node.typeAnnotation
  }

  if (isTSStringKeyword(node)) {
    return createTypeAnnotation('string')
  }
  if (isTSNumberKeyword(node)) {
    return createTypeAnnotation('number')
  }
  if (isTSBooleanKeyword(node)) {
    return createTypeAnnotation('boolean')
  }
  if (isTSAnyKeyword(node)) {
    return createTypeAnnotation(null, { isAny: true })
  }
  if (isTSNullKeyword(node) || isTSUndefinedKeyword(node)) {
    return createTypeAnnotation(null)
  }
  if (isTSTypeReference(node)) {
    const referenceTypeName = (node.typeName as Identifier).name

    return createTypeReferenceAnnotation(referenceTypeName)
  }
  if (isTSArrayType(node)) {
    const computedType = computeType(node.elementType, filePath)

    if (computedType.kind !== 'TypeReferenceAnnotation') {
      computedType.isArray = true
    }

    return computedType
  }
  if (isTSLiteralType(node)) {
    const literalValue = node.literal.value

    return createLiteralTypeAnnotation(typeof literalValue, literalValue)
  }

  if (isTSTypeLiteral(node)) {
    const fields = node.members as SupportedFields[]
    const interfaceFields = extractInterfaceFields(fields, filePath)

    return createAnonymousInterfaceAnnotation(interfaceFields)
  }

  if (isTSUnionType(node)) {
    const unionTypes = node.types.map(unionType =>
      computeType(unionType, filePath),
    )

    return createUnionTypeAnnotation(unionTypes, filePath)
  }

  console.log(
    chalk.yellow(
      `WARNING: Unsupported type ${node.type} (Line ${getLine(
        node,
      )} in ${filePath}). Please file an issue at https://github.com/prisma/graphqlgen/issues`,
    ),
  )

  return createTypeAnnotation('_UNKNOWN_TYPE_')
}

function getLine(node: BaseNode) {
  return node.loc === null ? 'unknown' : node.loc.start.line
}

function extractTypeAlias(
  typeName: string,
  typeAlias: TSTypeAliasDeclaration,
  filePath: string,
): TypeAliasDefinition | InterfaceDefinition {
  if (isTSTypeLiteral(typeAlias.typeAnnotation)) {
    return extractInterface(
      typeName,
      typeAlias.typeAnnotation.members,
      filePath,
    )
  } else {
    const typeAliasType = computeType(typeAlias.typeAnnotation, filePath)

    return createTypeAlias(typeName, typeAliasType, filePath)
  }
}

function isSupportedTypeOfField(field: TSTypeElement) {
  return isTSPropertySignature(field)
}

function throwIfUnsupportedFields(fields: TSTypeElement[], filePath: string) {
  const unsupportedFields = fields.filter(
    field => !isSupportedTypeOfField(field),
  )

  if (unsupportedFields.length > 0) {
    throw new Error(
      `Unsupported notation for fields: ${unsupportedFields
        .map(field => `Line ${getLine(field)} in ${filePath}`)
        .join(', ')}`,
    )
  }
}

function extractInterfaceFields(fields: TSTypeElement[], filePath: string) {
  throwIfUnsupportedFields(fields, filePath)

  return (fields as SupportedFields[]).map(field => {
    const fieldName = (field.key as Identifier).name

    if (!field.typeAnnotation) {
      throw new Error(
        `ERROR: Unsupported notation (Line ${getLine(field)} in ${filePath})`,
      )
    }

    const fieldType = computeType(
      field.typeAnnotation!.typeAnnotation,
      filePath,
    )
    const isOptional = isFieldOptional(field)

    return createInterfaceField(fieldName, fieldType, filePath, isOptional)
  })
}

function extractInterface(
  typeName: string,
  fields: TSTypeElement[],
  filePath: string,
): InterfaceDefinition {
  const interfaceFields = extractInterfaceFields(fields, filePath)

  return createInterface(typeName, interfaceFields)
}

export function buildTypesMap(filePath: string): TypesMap {
  if (filesToTypesMap[filePath] !== undefined) {
    return filesToTypesMap[filePath]
  }

  const file = fs.readFileSync(filePath).toString()

  const ast = parseTS(file, {
    plugins: ['typescript'],
    sourceType: 'module',
    tokens: true,
  })

  const typesMap = findTypescriptTypes(ast).reduce(
    (acc, type) => {
      const typeName = type.id.name
      if (type.type === 'TSTypeAliasDeclaration') {
        return {
          ...acc,
          [typeName]: extractTypeAlias(typeName, type, filePath),
        }
      }

      return {
        ...acc,
        [typeName]: extractInterface(typeName, type.body.body, filePath),
      }
    },
    {} as TypesMap,
  )

  filesToTypesMap[filePath] = typesMap

  return typesMap
}

function shouldExtractType(node: Statement) {
  return (
    node.type === 'TSTypeAliasDeclaration' ||
    node.type === 'TSInterfaceDeclaration'
  )
}

function findTypescriptTypes(sourceFile: TSFile): ExtractableType[] {
  const statements = sourceFile.program.body

  const types = statements.filter(shouldExtractType)

  const typesFromNamedExport = statements
    .filter(
      node =>
        node.type === 'ExportNamedDeclaration' &&
        node.declaration !== null &&
        shouldExtractType(node.declaration),
    )
    .map(node => {
      return (node as ExportNamedDeclaration).declaration
    })

  return [...types, ...typesFromNamedExport] as ExtractableType[]
}

export function findTypeInFile(
  filePath: string,
  typeName: string,
): TypeDefinition | undefined {
  const filesToTypesMap = buildFilesToTypesMap([{ path: filePath }])

  return filesToTypesMap[filePath][typeName]
}

function isFieldOptional(node: TSPropertySignature) {
  if (!!node.optional) {
    return true
  }

  if (
    node.typeAnnotation &&
    node.typeAnnotation.typeAnnotation.type === 'TSNullKeyword'
  ) {
    return true
  }

  if (
    node.typeAnnotation &&
    node.typeAnnotation.typeAnnotation.type === 'TSUnionType'
  ) {
    return (node.typeAnnotation.typeAnnotation as TSUnionType).types.some(
      unionType => unionType.type === 'TSNullKeyword',
    )
  }

  return false
}
