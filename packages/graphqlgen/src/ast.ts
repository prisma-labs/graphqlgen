import * as path from 'path'
import * as fs from 'fs'
import * as ts from 'typescript'
import { File } from 'graphqlgen-json-schema'
import { getPath } from './parse'
import { Model } from './types'

export interface InterfaceNamesToFile {
  [interfaceName: string]: File
}

export interface ModelField {
  fieldName: string
  fieldOptional: boolean
}

export function getChildrenNodes(source: ts.Node | ts.SourceFile): ts.Node[] {
  const nodes: ts.Node[] = []

  source.forEachChild(node => {
    nodes.push(node)
  })

  return nodes
}

function getSourceFile(fileName: string, filePath: string): ts.SourceFile {
  return ts.createSourceFile(
    fileName,
    fs.readFileSync(filePath).toString(),
    ts.ScriptTarget.ES2015,
  )
}

function shouldExtractType(node: ts.Node) {
  return (
    node.kind === ts.SyntaxKind.InterfaceDeclaration ||
    node.kind === ts.SyntaxKind.TypeAliasDeclaration
  )
}

export function findTypescriptInterfaceByName(
  filePath: string,
  interfaceName: string,
): ts.Node | undefined {
  const fileName = path.basename(filePath)

  const sourceFile = getSourceFile(fileName, filePath)

  // NOTE unfortunately using `.getChildren()` didn't work, so we had to use the `forEachChild` method
  return getChildrenNodes(sourceFile).find(
    node =>
      shouldExtractType(node) &&
      (node as ts.InterfaceDeclaration).name.escapedText === interfaceName,
  )
}

export function typeNamesFromTypescriptFile(file: File): string[] {
  const filePath = getPath(file)
  const fileName = path.basename(filePath)

  const sourceFile = getSourceFile(fileName, filePath)

  // NOTE unfortunately using `.getChildren()` didn't work, so we had to use the `forEachChild` method
  return getChildrenNodes(sourceFile)
    .filter(shouldExtractType)
    .map(node => (node as ts.InterfaceDeclaration).name.escapedText as string)
}

// TODO: Check TS ast to evaluate union types and null
// TODO: Check out tmp.json file and see `types` for `name` property
function isFieldOptional(node: ts.PropertySignature) {
  if (!!node.questionToken) {
    return true
  }

  if (node.type && node.type.kind === ts.SyntaxKind.NullKeyword) {
    return true
  }

  if (node.type && node.type.kind === ts.SyntaxKind.UnionType) {
    return (node.type as ts.UnionTypeNode).types.some(
      unionType => unionType.kind === ts.SyntaxKind.NullKeyword,
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

  // NOTE unfortunately using `.getChildren()` didn't work, so we had to use the `forEachChild` method
  const interfaceChildNodes = getChildrenNodes(typeNode)

  return interfaceChildNodes
    .filter(childNode => childNode.kind === ts.SyntaxKind.PropertySignature)
    .map(childNode => {
      const childNodeProperty = childNode as ts.PropertySignature
      const fieldName = (childNodeProperty.name as ts.Identifier).text
      const fieldOptional = isFieldOptional(childNodeProperty)

      return { fieldName, fieldOptional }
    })
}
