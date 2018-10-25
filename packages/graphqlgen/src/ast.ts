import * as path from 'path'
import * as fs from 'fs'
import * as ts from 'typescript'
import { File } from 'graphqlgen-json-schema'
import { getPath } from './parse'

export interface InterfaceNamesToFile {
  [interfaceName: string]: File
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

export function findTypescriptInterfaceByName(
  filePath: string,
  interfaceName: string,
): ts.Node | undefined {
  const fileName = path.basename(filePath)

  const sourceFile = getSourceFile(fileName, filePath)

  // NOTE unfortunately using `.getChildren()` didn't work, so we had to use the `forEachChild` method
  return getChildrenNodes(sourceFile).find(
    node =>
      node.kind === ts.SyntaxKind.InterfaceDeclaration &&
      (node as ts.InterfaceDeclaration).name.escapedText === interfaceName,
  )
}

export function typeNamesFromTypescriptFile(file: File): string[] {
  const filePath = getPath(file)
  const fileName = path.basename(filePath)

  const sourceFile = getSourceFile(fileName, filePath)

  // NOTE unfortunately using `.getChildren()` didn't work, so we had to use the `forEachChild` method
  return getChildrenNodes(sourceFile)
    .filter(
      node =>
        node.kind === ts.SyntaxKind.InterfaceDeclaration ||
        node.kind === ts.SyntaxKind.TypeAliasDeclaration,
    )
    .map(node => (node as ts.InterfaceDeclaration).name.escapedText as string)
}
