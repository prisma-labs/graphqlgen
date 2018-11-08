import * as path from 'path'
import { existsSync } from 'fs'
import { Language } from 'graphqlgen-json-schema'

import { getExtNameFromLanguage } from './path-helpers'
import { NormalizedFile } from './parse'
import { FilesToTypesMap, InterfaceNamesToFile } from './introspection/types'

export function upperFirst(s: string) {
  return s.replace(/^\w/, c => c.toUpperCase())
}

/**
 * Support for different path notation
 *
 * './path/to/index.ts' => './path/to/index.ts'
 * './path/to' => './path/to/to.ts'
 * './path/to' => './path/to/index.ts'
 * './path/to/' => './path/to/index.ts'
 */

export function normalizeFilePath(
  filePath: string,
  language: Language,
): string {
  const ext = getExtNameFromLanguage(language)

  if (path.extname(filePath) !== ext) {
    const pathToFileWithExt = path.resolve(filePath) + ext

    if (existsSync(pathToFileWithExt)) {
      return pathToFileWithExt
    }

    return path.join(path.resolve(filePath), 'index' + ext)
  }

  return path.resolve(filePath)
}

/**
 * Create a map of interface names to the path of the file in which they're defined
 * The first evaluated interfaces are always the chosen ones
 */
export function getTypeToFileMapping(
  files: NormalizedFile[],
  filesToTypesMap: FilesToTypesMap,
): InterfaceNamesToFile {
  return files.reduce(
    (acc, file) => {
      const typesMap = filesToTypesMap[file.path]
      const interfaceNames = Object.keys(typesMap).filter(
        interfaceName => !acc[interfaceName],
      )

      interfaceNames.forEach(interfaceName => {
        acc[interfaceName] = file
      })

      return acc
    },
    {} as InterfaceNamesToFile,
  )
}

export function replaceAll(str: string, search: string, replacement: string) {
  return str.split(search).join(replacement)
}

export function flatten(a: Array<any>, b: Array<any>) {
  return [...a, ...b]
}

export function uniq(value: any, index: number, array: Array<any>) {
  return array.indexOf(value) === index
}
