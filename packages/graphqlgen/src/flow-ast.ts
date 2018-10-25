import * as fs from 'fs'

import { parse as parseFlow } from '@babel/parser'
import {
  ExportNamedDeclaration,
  File as FlowFile,
  Statement,
  TypeAlias,
  InterfaceDeclaration,
} from '@babel/types'
import { File } from 'graphqlgen-json-schema'

import { getPath } from './parse'

//TODO: Add caching with { [filePath: string]: ExtractableType[] } or something

type ExtractableType = TypeAlias | InterfaceDeclaration

function getSourceFile(filePath: string) {
  const file = fs.readFileSync(filePath).toString('utf-8')

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

export function findFlowTypeByName(filePath: string, typeName: string) {
  const sourceFile = getSourceFile(filePath)

  return getFlowTypes(sourceFile).find(node => node.id.name === typeName)
}

export function typeNamesFromFlowFile(file: File): string[] {
  const filePath = getPath(file)
  const sourceFile = getSourceFile(filePath)

  return getFlowTypes(sourceFile).map(node => node.id.name)
}
