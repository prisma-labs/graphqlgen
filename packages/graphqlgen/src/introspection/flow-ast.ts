import { parse as parseFlow } from '@babel/parser'
import {
  ExportNamedDeclaration,
  File as FlowFile,
  Statement,
  TypeAlias,
  InterfaceDeclaration,
  ObjectTypeProperty,
  UnionTypeAnnotation,
  isTypeAlias,
  ObjectTypeSpreadProperty,
  isObjectTypeProperty,
  Identifier,
  StringLiteral,
  isObjectTypeAnnotation,
  FlowType,
  isStringTypeAnnotation,
  isNumberTypeAnnotation,
  isBooleanTypeAnnotation,
  isAnyTypeAnnotation,
  isGenericTypeAnnotation,
  isArrayTypeAnnotation,
  isStringLiteralTypeAnnotation,
  isNumberLiteralTypeAnnotation,
  isBooleanLiteralTypeAnnotation,
  isUnionTypeAnnotation,
  isNullLiteralTypeAnnotation,
} from '@babel/types'

import {
  TypeAliasDefinition,
  InterfaceDefinition,
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

type ExtractableType = TypeAlias | InterfaceDeclaration

function shouldExtractType(node: Statement) {
  return node.type === 'TypeAlias' || node.type === 'InterfaceDeclaration'
}

function findFlowTypes(sourceFile: FlowFile): ExtractableType[] {
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

export function isFieldOptional(node: ObjectTypeProperty) {
  if (!!node.optional) {
    return true
  }

  if (node.value.type === 'NullLiteralTypeAnnotation') {
    return true
  }

  if (node.value.type === 'UnionTypeAnnotation') {
    return (node.value as UnionTypeAnnotation).types.some(
      unionType => unionType.type === 'NullLiteralTypeAnnotation',
    )
  }

  return false
}

export function computeType(
  node: FlowType,
  filePath: string,
): InternalInnerType {
  if (isStringTypeAnnotation(node)) {
    return createTypeAnnotation('string')
  }
  if (isNumberTypeAnnotation(node)) {
    return createTypeAnnotation('number')
  }
  if (isBooleanTypeAnnotation(node)) {
    return createTypeAnnotation('boolean')
  }
  if (isAnyTypeAnnotation(node)) {
    return createTypeAnnotation(null, { isAny: true })
  }
  if (
    (isGenericTypeAnnotation(node) && node.id.name === 'undefined') ||
    isNullLiteralTypeAnnotation(node)
  ) {
    return createTypeAnnotation(null)
  }
  if (isGenericTypeAnnotation(node)) {
    const referenceTypeName = node.id.name

    return createTypeReferenceAnnotation(referenceTypeName)
  }
  if (isArrayTypeAnnotation(node)) {
    const computedType = computeType(node.elementType, filePath)

    if (computedType.kind !== 'TypeReferenceAnnotation') {
      computedType.isArray = true
    }

    return computedType
  }
  if (
    isStringLiteralTypeAnnotation(node) ||
    isNumberLiteralTypeAnnotation(node) ||
    isBooleanLiteralTypeAnnotation(node)
  ) {
    const literalValue = node.value

    return createLiteralTypeAnnotation(typeof literalValue, literalValue)
  }

  if (isObjectTypeAnnotation(node)) {
    const interfaceFields = extractInterfaceFields(node.properties, filePath)

    return createAnonymousInterfaceAnnotation(interfaceFields)
  }

  if (isUnionTypeAnnotation(node)) {
    const unionTypes = node.types.map(unionType =>
      computeType(unionType, filePath),
    )

    return createUnionTypeAnnotation(unionTypes, filePath)
  }

  return createTypeAnnotation('_UNKNOWN_TYPE_')
}

function extractTypeAlias(
  typeName: string,
  typeAlias: TypeAlias,
  filePath: string,
): TypeAliasDefinition | InterfaceDefinition {
  if (isObjectTypeAnnotation(typeAlias.right)) {
    return extractInterface(typeName, typeAlias.right.properties, filePath)
  } else {
    const typeAliasType = computeType(typeAlias.right, filePath)

    return createTypeAlias(typeName, typeAliasType, filePath)
  }
}

function isSupportedTypeOfField(
  field: ObjectTypeProperty | ObjectTypeSpreadProperty,
) {
  return isObjectTypeProperty(field)
}

function extractInterfaceFieldName(
  field: ObjectTypeProperty | ObjectTypeSpreadProperty,
): string {
  if (isObjectTypeProperty(field)) {
    return field.key.type === 'Identifier'
      ? (field.key as Identifier).name
      : (field.key as StringLiteral).value
  }

  return ''
}

function extractInterfaceFields(
  fields: (ObjectTypeProperty | ObjectTypeSpreadProperty)[],
  filePath: string,
) {
  return fields.map(field => {
    const fieldName = extractInterfaceFieldName(field)

    if (!isSupportedTypeOfField(field)) {
      return createInterfaceField(
        '',
        createTypeAnnotation('_UNKNOWN_TYPE_'),
        filePath,
        false,
      )
    }

    const fieldAsObjectTypeProperty = field as ObjectTypeProperty
    const fieldType = computeType(fieldAsObjectTypeProperty.value, filePath)
    const isOptional = isFieldOptional(fieldAsObjectTypeProperty)

    return createInterfaceField(fieldName, fieldType, filePath, isOptional)
  })
}

function extractInterface(
  typeName: string,
  fields: (ObjectTypeProperty | ObjectTypeSpreadProperty)[],
  filePath: string,
): InterfaceDefinition {
  const interfaceFields = extractInterfaceFields(fields, filePath)

  return createInterface(typeName, interfaceFields)
}

export function buildFlowTypesMap(fileContent: string, filePath: string) {
  const ast = parseFlow(fileContent, {
    plugins: ['flow'],
    sourceType: 'module',
  })

  const typesMap = findFlowTypes(ast).reduce(
    (acc, type) => {
      const typeName = type.id.name

      if (isTypeAlias(type)) {
        return {
          ...acc,
          [typeName]: extractTypeAlias(typeName, type, filePath),
        }
      }

      return {
        ...acc,
        [typeName]: extractInterface(typeName, type.body.properties, filePath),
      }
    },
    {} as TypesMap,
  )

  return typesMap
}
