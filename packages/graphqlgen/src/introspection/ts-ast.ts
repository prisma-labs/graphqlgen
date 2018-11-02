import * as fs from 'fs'
import { File } from 'graphqlgen-json-schema'
import { getPath } from '../parse'
import { Model } from '../types'
import { parse as parseTS } from '@babel/parser'
import {
  File as TSFile,
  TSTypeAliasDeclaration,
  TSInterfaceDeclaration,
  Statement,
  ExportNamedDeclaration,
  TSTypeLiteral,
  TSInterfaceBody,
  TSPropertySignature,
  Identifier,
  TSUnionType,
} from '@babel/types'

export interface InterfaceNamesToFile {
  [interfaceName: string]: File
}

export interface ModelField {
  fieldName: string
  fieldOptional: boolean
}

type ExtractableType = TSTypeAliasDeclaration | TSInterfaceDeclaration

function getSourceFile(filePath: string): TSFile {
  const file = fs.readFileSync(filePath).toString()

  return parseTS(file, { plugins: ['typescript'], sourceType: 'module' })
}

function shouldExtractType(node: Statement) {
  return (
    node.type === 'TSTypeAliasDeclaration' ||
    node.type === 'TSInterfaceDeclaration'
  )
}

function getTypescriptTypes(sourceFile: TSFile): ExtractableType[] {
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

export function findTypescriptInterfaceByName(
  filePath: string,
  typeName: string,
): ExtractableType | undefined {
  const sourceFile = getSourceFile(filePath)

  return getTypescriptTypes(sourceFile).find(node => node.id.name === typeName)
}

export function typeNamesFromTypescriptFile(file: File): string[] {
  const filePath = getPath(file)
  const sourceFile = getSourceFile(filePath)

  return getTypescriptTypes(sourceFile).map(node => node.id.name)
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

export function extractFieldsFromTypescriptType(model: Model): ModelField[] {
  const filePath = model.absoluteFilePath
  const typeNode = findTypescriptInterfaceByName(filePath, model.modelTypeName)

  if (!typeNode) {
    throw new Error(`No interface found for name ${model.modelTypeName}`)
  }

  if (
    typeNode.type === 'TSTypeAliasDeclaration' &&
    (typeNode as TSTypeAliasDeclaration).typeAnnotation.type !== 'TSTypeLiteral'
  ) {
    throw new Error(
      `Type notation not supported for type ${model.modelTypeName}`,
    )
  }

  const childrenNodes =
    typeNode.type === 'TSTypeAliasDeclaration'
      ? ((typeNode as TSTypeAliasDeclaration).typeAnnotation as TSTypeLiteral)
          .members
      : ((typeNode as TSInterfaceDeclaration).body as TSInterfaceBody).body

  return childrenNodes
    .filter(childNode => childNode.type === 'TSPropertySignature')
    .map(childNode => {
      const childNodeProperty = childNode as TSPropertySignature
      const fieldName = (childNodeProperty.key as Identifier).name
      const fieldOptional = isFieldOptional(childNodeProperty)

      return { fieldName, fieldOptional }
    })
}
