import { parse as parseTS } from '@babel/parser'
import {
  ExportNamedDeclaration,
  File as TSFile,
  Identifier,
  isTSPropertySignature,
  isTSTypeLiteral,
  Statement,
  TSInterfaceDeclaration,
  TSPropertySignature,
  TSTypeAliasDeclaration,
  TSTypeElement,
  TSUnionType,
  TSType,
  isTSParenthesizedType,
  isTSStringKeyword,
  isTSNumberKeyword,
  isTSBooleanKeyword,
  isTSAnyKeyword,
  isTSNullKeyword,
  isTSUndefinedKeyword,
  isTSTypeReference,
  isTSArrayType,
  isTSLiteralType,
  isTSUnionType,
  isTSTypeAliasDeclaration,
} from '@babel/types'
import {
  InterfaceDefinition,
  TypeAliasDefinition,
  TypesMap,
  InternalInnerType,
} from './types'
import {
  createInterface,
  createInterfaceField,
  createTypeAlias,
  createTypeAnnotation,
  createTypeReferenceAnnotation,
  createLiteralTypeAnnotation,
  createAnonymousInterfaceAnnotation,
  createUnionTypeAnnotation,
} from './factory'
import { getLine } from './utils'
import chalk from 'chalk'

// /!\ If you add a supported type of field, make sure you update isSupportedField() as well
type SupportedFields = TSPropertySignature

type ExtractableType = TSTypeAliasDeclaration | TSInterfaceDeclaration

function shouldExtractType(node: Statement) {
  return (
    node.type === 'TSTypeAliasDeclaration' ||
    node.type === 'TSInterfaceDeclaration'
  )
}

export function computeType(node: TSType, filePath: string): InternalInnerType {
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

export function buildTSTypesMap(fileContent: string, filePath: string) {
  const ast = parseTS(fileContent, {
    plugins: ['typescript'],
    sourceType: 'module',
  })

  const typesMap = findTypescriptTypes(ast).reduce(
    (acc, type) => {
      const typeName = type.id.name

      if (isTSTypeAliasDeclaration(type)) {
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

  return typesMap
}
