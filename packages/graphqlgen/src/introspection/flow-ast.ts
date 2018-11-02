import * as fs from 'fs'

import { parse as parseFlow } from '@babel/parser'
import {
  ExportNamedDeclaration,
  File as FlowFile,
  Statement,
  TypeAlias,
  InterfaceDeclaration,
  ObjectTypeAnnotation,
  ObjectTypeProperty,
  Identifier,
  UnionTypeAnnotation,
} from '@babel/types'
import { File } from 'graphqlgen-json-schema'

import { getPath } from '../parse'
import { Model } from '../types'
import { ModelField } from './ts-ast'

//TODO: Add caching with { [filePath: string]: ExtractableType[] } or something
type ExtractableType = TypeAlias | InterfaceDeclaration

function getSourceFile(filePath: string): FlowFile {
  const file = fs.readFileSync(filePath).toString()

  return parseFlow(file, { plugins: ['flow'] })
}

function shouldExtractType(node: Statement) {
  return node.type === 'TypeAlias' || node.type === 'InterfaceDeclaration'
}

function getFlowTypes(sourceFile: FlowFile): ExtractableType[] {
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

export function findFlowTypeByName(
  filePath: string,
  typeName: string,
): ExtractableType | undefined {
  const sourceFile = getSourceFile(filePath)

  return getFlowTypes(sourceFile).find(node => node.id.name === typeName)
}

export function typeNamesFromFlowFile(file: File): string[] {
  const filePath = getPath(file)
  const sourceFile = getSourceFile(filePath)

  return getFlowTypes(sourceFile).map(node => node.id.name)
}

function isFieldOptional(node: ObjectTypeProperty) {
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

export function extractFieldsFromFlowType(model: Model): ModelField[] {
  const filePath = model.absoluteFilePath
  const typeNode = findFlowTypeByName(filePath, model.modelTypeName)

  if (!typeNode) {
    throw new Error(`No interface found for name ${model.modelTypeName}`)
  }

  const childrenNodes =
    typeNode.type === 'TypeAlias'
      ? (typeNode as TypeAlias).right
      : (typeNode as InterfaceDeclaration).body

  return (childrenNodes as ObjectTypeAnnotation).properties
    .filter(childNode => childNode.type === 'ObjectTypeProperty')
    .map(childNode => {
      const childNodeProperty = childNode as ObjectTypeProperty
      const fieldName = (childNodeProperty.key as Identifier).name
      const fieldOptional = isFieldOptional(childNodeProperty)

      return { fieldName, fieldOptional }
    })
}
