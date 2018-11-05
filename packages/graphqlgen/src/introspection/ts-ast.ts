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
  TSEnumDeclaration,
  isTSEnumDeclaration,
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

// /!\ If you add a supported type of field, make sure you update isSupportedField() as well
type SupportedFields = TSPropertySignature

type ExtractableType =
  | TSTypeAliasDeclaration
  | TSInterfaceDeclaration
  | TSEnumDeclaration

function shouldExtractType(node: Statement) {
  return (
    node.type === 'TSTypeAliasDeclaration' ||
    node.type === 'TSInterfaceDeclaration' ||
    node.type === 'TSEnumDeclaration'
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

// Enums are converted to TypeAlias of UnionType
// enum Enum { A, B, C } => type Enum = 'A' | 'B' | 'C'
function extractEnum(
  enumName: string,
  enumType: TSEnumDeclaration,
  filePath: string,
): TypeAliasDefinition {
  if (
    enumType.members.some(enumMember => enumMember.id.type === 'StringLiteral')
  ) {
    throw new Error(
      `ERROR: Enum initializers not supported (${enumName} in ${filePath}).`,
    )
  }

  const enumValuesAsLiteralStrings = enumType.members.map(enumMember => {
    return createLiteralTypeAnnotation(
      'string',
      (enumMember.id as Identifier).name,
    )
  })
  const unionType = createUnionTypeAnnotation(
    enumValuesAsLiteralStrings,
    filePath,
  )

  return createTypeAlias(enumName, unionType, filePath)
}

function isSupportedTypeOfField(field: TSTypeElement) {
  return isTSPropertySignature(field)
}

function extractInterfaceFieldName(field: TSTypeElement): string {
  if (isTSPropertySignature(field)) {
    return (field.key as Identifier).name
  }

  return ''
}

function extractInterfaceFields(fields: TSTypeElement[], filePath: string) {
  return fields.map(field => {
    const fieldName = extractInterfaceFieldName(field)

    if (!isSupportedTypeOfField(field) || !field.typeAnnotation) {
      return createInterfaceField(
        '',
        createTypeAnnotation('_UNKNOWN_TYPE_'),
        filePath,
        false,
      )
    }

    const fieldType = computeType(
      field.typeAnnotation!.typeAnnotation,
      filePath,
    )
    const isOptional = isFieldOptional(field as TSPropertySignature)

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

      if (isTSEnumDeclaration(type)) {
        return {
          ...acc,
          [typeName]: extractEnum(typeName, type, filePath),
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
