import * as fs from 'fs'
import { Language } from 'graphqlgen-json-schema'

import { FilesToTypesMap, TypeDefinition, TypesMap } from './types'
import { buildTSTypesMap } from './ts-ast'
import { buildFlowTypesMap } from './flow-ast'
import { NormalizedFile } from '../parse'

export const filesToTypesMap: { [filePath: string]: TypesMap } = {}

function buildTypesMapByLanguage(
  fileContent: string,
  filePath: string,
  language: Language,
): TypesMap {
  switch (language) {
    case 'typescript':
      return buildTSTypesMap(fileContent, filePath)
    case 'flow':
      return buildFlowTypesMap(fileContent, filePath)
  }
}

export function addFileToTypesMap(
  filePath: string,
  language: Language,
): TypesMap {
  if (filesToTypesMap[filePath] !== undefined) {
    return filesToTypesMap[filePath]
  }

  const fileContent = fs.readFileSync(filePath).toString()

  const typesMap = buildTypesMapByLanguage(fileContent, filePath, language)

  filesToTypesMap[filePath] = typesMap

  return typesMap
}

export function findTypeInFile(
  filePath: string,
  typeName: string,
  language: Language,
): TypeDefinition | undefined {
  addFileToTypesMap(filePath, language)

  return filesToTypesMap[filePath][typeName]
}

export function addFilesToTypesMap(
  files: NormalizedFile[],
  language: Language,
): FilesToTypesMap {
  files.forEach(file => {
    addFileToTypesMap(file.path, language)
  })

  return filesToTypesMap
}

export function getFilesToTypesMap() {
  return filesToTypesMap
}
