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

export function buildTypesMap(filePath: string, language: Language): TypesMap {
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
  const filesToTypesMap = buildFilesToTypesMap([{ path: filePath }], language)

  return filesToTypesMap[filePath][typeName]
}

export function buildFilesToTypesMap(
  files: NormalizedFile[],
  language: Language,
): FilesToTypesMap {
  return files.reduce((acc, file) => {
    return {
      ...acc,
      [file.path]: buildTypesMap(file.path, language),
    }
  }, {})
}
