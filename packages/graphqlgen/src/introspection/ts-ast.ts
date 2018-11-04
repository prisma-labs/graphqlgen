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
import chalk from "chalk";

type Type =
  | TypeAnnotation
  | UnionTypeAnnotation
  | AnonymousInterfaceAnnotation
  | LiteralTypeAnnotation

type UnknownType = '_UNKNOWN_TYPE_'
type PrimitiveOrTypeRef = string | null | UnknownType

// /!\ If you add a supported type of field, make sure you update isSupportedField() as well
type SupportedFields = TSPropertySignature

interface UnionTypeAnnotation {
  kind: 'UnionTypeAnnotation'
  types: Type[]
  isArray: boolean
}

interface TypeAnnotation {
  kind: 'TypeAnnotation'
  type: PrimitiveOrTypeRef
  isArray: boolean
  isTypeRef: boolean
}

export interface AnonymousInterfaceAnnotation {
  kind: 'AnonymousInterfaceAnnotation'
  fields: FieldDefinition[]
  isArray: boolean
}

interface LiteralTypeAnnotation {
  kind: 'LiteralTypeAnnotation'
  type: string
  value: string | number | boolean
  isArray: boolean
}

type Kind =
  | 'InterfaceDefinition'
  | 'FieldDefinition'
  | 'TypeAliasDefinition'
  | 'TypeAliasValueDefinition'

interface BaseTypeDefinition {
  kind: Kind
  name: string
}

interface FieldDefinition {
  name: string
  type: Type
  optional: boolean
}

export interface InterfaceDefinition extends BaseTypeDefinition {
  fields: FieldDefinition[]
}

export interface TypeAliasDefinition extends BaseTypeDefinition {
  type: Type
  isEnum: boolean //If type is UnionType && `types` are scalar strings
}

export type Types = InterfaceDefinition | TypeAliasDefinition

export interface TypesMap {
  [typeName: string]: Types
}

export interface InterfaceNamesToFile {
  [interfaceName: string]: File
}

export interface ModelField {
  fieldName: string
  fieldOptional: boolean
}

type ExtractableType = TSTypeAliasDeclaration | TSInterfaceDeclaration

function createTypeAlias(name: string, type: Type): TypeAliasDefinition {
  return {
    kind: 'TypeAliasDefinition',
    name,
    type,
    isEnum:
      type.kind === 'UnionTypeAnnotation' &&
      type.types.every(unionType => {
        return (
          unionType.kind === 'LiteralTypeAnnotation' &&
          unionType.isArray === false &&
          unionType.type === 'string'
        )
      }),
  }
}

function createInterfaceField(
  name: string,
  type: Type,
  optional: boolean,
): FieldDefinition {
  return {
    name,
    type,
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
  type: PrimitiveOrTypeRef,
  options?: TypeAnnotationOpts,
): TypeAnnotation {
  let opts: TypeAnnotationOpts = {}
  if (options === undefined) {
    opts = { isArray: false, isTypeRef: false, isAny: false }
  } else {
    opts = {
      isArray: options.isArray === undefined ? false : options.isArray,
      isTypeRef: options.isTypeRef === undefined ? false : options.isTypeRef,
      isAny: options.isAny === undefined ? false : options.isAny,
    }
  }

  const isArray = opts.isArray === undefined ? false : opts.isArray
  const isTypeRef = opts.isTypeRef === undefined ? false : opts.isTypeRef

  return {
    kind: 'TypeAnnotation',
    type,
    isArray,
    isTypeRef,
  }
}

function createUnionTypeAnnotation(
  types: Type[],
  isArray: boolean = false,
): UnionTypeAnnotation {
  return {
    kind: 'UnionTypeAnnotation',
    types,
    isArray,
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

function computeType(node: TSType, filePath: string): Type {
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
  if (isTSNullKeyword(node)) {
    return createTypeAnnotation(null)
  }
  if (isTSNullKeyword(node) || isTSUndefinedKeyword(node)) {
    return createTypeAnnotation(null)
  }
  if (isTSTypeReference(node)) {
    const typeRefName = (node.typeName as Identifier).name

    return createTypeAnnotation(typeRefName, { isTypeRef: true })
  }
  if (isTSArrayType(node)) {
    const computedType = computeType(node.elementType, filePath)

    computedType.isArray = true

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
    const unionTypes = node.types.map(unionType => computeType(unionType, filePath))

    return createUnionTypeAnnotation(unionTypes)
  }

  console.log(
    chalk.yellow(`WARNING: Unsupported type ${node.type} (Line ${getLine(
      node,
    )} in ${filePath}). Please file an issue at https://github.com/prisma/graphqlgen/issues`),
  )

  return createTypeAnnotation('_UNKNOWN_TYPE_')
}

function getLine(node: BaseNode) {
  return node.loc === null ? 'unknown' : node.loc.start.line
}

function extractTypeAlias(
  typeName: string,
  typeAlias: TSTypeAliasDeclaration,
  filePath: string
): TypeAliasDefinition | InterfaceDefinition {
  if (isTSTypeLiteral(typeAlias.typeAnnotation)) {
    return extractInterface(typeName, typeAlias.typeAnnotation.members, filePath)
  } else {
    const typeAliasType = computeType(typeAlias.typeAnnotation, filePath)

    return createTypeAlias(typeName, typeAliasType)
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
      throw new Error(`ERROR: Unsupported notation (Line ${getLine(field)} in ${filePath})`)
    }

    const fieldType = computeType(field.typeAnnotation!.typeAnnotation, filePath)
    const isOptional = isFieldOptional(field)

    return createInterfaceField(fieldName, fieldType, isOptional)
  })
}

function extractInterface(
  typeName: string,
  fields: TSTypeElement[],
  filePath: string
): InterfaceDefinition {
  const interfaceFields = extractInterfaceFields(fields, filePath)

  return createInterface(typeName, interfaceFields)
}

const cachedFilesToTypeMaps: { [filePath: string]: TypesMap } = {}

export function buildTypesMap(filePath: string): TypesMap {
  if (cachedFilesToTypeMaps[filePath] !== undefined) {
    return cachedFilesToTypeMaps[filePath]
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

  cachedFilesToTypeMaps[filePath] = typesMap

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
): Types | undefined {
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
