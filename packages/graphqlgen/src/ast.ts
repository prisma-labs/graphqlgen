import * as path from 'path'
import * as fs from 'fs'
import * as ts from 'typescript'

export function getChildrenNodes(source: ts.Node | ts.SourceFile) {
  const nodes: ts.Node[] = []

  source.forEachChild(node => {
    nodes.push(node)
  })

  return nodes;
}

export function findInterfaceByName(filePath: string, interfaceName: string): ts.Node | undefined {
  const fileName = path.basename(filePath)

  const sourceFile = ts.createSourceFile(
    fileName,
    fs.readFileSync(filePath).toString(),
    ts.ScriptTarget.ES2015,
  )

  // NOTE unfortunately using `.getChildren()` didn't work, so we had to use the `forEachChild` method
  return getChildrenNodes(sourceFile).find(
    node =>
      node.kind === ts.SyntaxKind.InterfaceDeclaration &&
      (node as ts.InterfaceDeclaration).name.escapedText === interfaceName,
  )
}
