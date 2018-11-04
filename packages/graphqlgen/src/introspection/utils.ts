import { BaseNode } from '@babel/types'

import {
  InnerAndTypeDefinition,
  InternalInnerType,
  LiteralTypeAnnotation,
  UnionTypeAnnotation,
} from './types'

import { filesToTypesMap } from './index'

export function buildTypeGetter(
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

export function isLiteralString(type: InnerAndTypeDefinition) {
  return type.kind === 'LiteralTypeAnnotation' && type.type === 'string'
}

export function getEnumValues(type: InnerAndTypeDefinition): string[] {
  // If type is: 'value'
  if (isLiteralString(type)) {
    return [(type as LiteralTypeAnnotation).value as string]
  }

  if (type.kind === 'TypeAliasDefinition' && isLiteralString(type.getType())) {
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

export function isEnumUnion(unionTypes: InnerAndTypeDefinition[]) {
  return unionTypes.every(unionType => {
    return (
      unionType.kind === 'LiteralTypeAnnotation' &&
      unionType.isArray === false &&
      unionType.type === 'string'
    )
  })
}

export function getLine(node: BaseNode) {
  return node.loc === null ? 'unknown' : node.loc.start.line
}
