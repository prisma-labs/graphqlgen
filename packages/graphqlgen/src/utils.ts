import * as path from 'path'
import { Language, File } from 'graphqlgen-json-schema'

import { getExtNameFromLanguage } from './path-helpers'
import { InterfaceNamesToFile, typeNamesFromTypescriptFile } from './introspection/ts-ast'
import { typeNamesFromFlowFile } from './introspection/flow-ast'

export function upperFirst(s: string) {
  return s.replace(/^\w/, c => c.toUpperCase())
}

/**
 * Support for different path notation
 *
 * './path/to/index.ts' => './path/to/index.ts'
 * './path/to' => './path/to/index.ts'
 * './path/to/' => './path/to/index.ts'
 */

export function normalizeFilePath(
  filePath: string,
  language: Language,
): string {
  const ext = getExtNameFromLanguage(language)

  if (path.extname(filePath) !== ext) {
    return path.join(path.resolve(filePath), 'index' + ext)
  }

  return filePath
}

function typeNamesFromFile(file: File, language: Language) {
  switch (language) {
    case 'typescript':
      return typeNamesFromTypescriptFile(file)
    case 'flow':
      return typeNamesFromFlowFile(file)
  }
}

/**
 * Create a map of interface names to the path of the file in which they're defined
 * The first evaluated interfaces are always the chosen ones
 */
export function getTypeToFileMapping(
  files: File[],
  language: Language,
): InterfaceNamesToFile {
  return files.reduce((acc: InterfaceNamesToFile, file: File) => {
    const interfaceNames = typeNamesFromFile(file, language).filter(
      interfaceName => !acc[interfaceName],
    )

    interfaceNames.forEach(interfaceName => {
      acc[interfaceName] = file
    })

    return acc
  }, {})
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
