import * as path from 'path'
import { Language } from 'graphqlgen-json-schema'

import { getExtNameFromLanguage } from './path-helpers'

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
