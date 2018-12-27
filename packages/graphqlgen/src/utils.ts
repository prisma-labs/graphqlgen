import * as Path from 'path'
import * as FS from 'fs'
import { Language } from 'graphqlgen-json-schema'

import { getExtNameFromLanguage } from './path-helpers'
import { NormalizedFile } from './parse'
import { FilesToTypesMap, InterfaceNamesToFile } from './introspection/types'

/**
 * Uppercase the first letter of a string. Useful when generating type names.
 */
const upperFirst = (s: string): string => {
  return s.replace(/^\w/, c => c.toUpperCase())
}

/**
 * Append a file extension to a file name. Leading dots in given
 * file extension are gracefully dropped.
 */
const appendExt = (ext: string, filePath: string): string => {
  const normalizedExt = ext.replace(/^\.+/, '')
  return filePath + '.' + normalizedExt
}

/**
 * Normalize different kinds of path notation. Will do synchronous
 * file IO to accomplish task.
 *
 * Examples:
 *
 *    ./path/to/index.ts => `pwd`/path/to/index.ts
 *    ./path/to          => `pwd`/path/to/to.ts
 *    ./path/to          => `pwd`/path/to/index.ts
 *    ./path/to/         => `pwd`/path/to/index.ts
 */
const normalizeFilePath = (filePath: string, language: Language): string => {
  const ext = getExtNameFromLanguage(language)

  // If the filepath is set against a file then just return that.
  if (Path.extname(filePath) === ext) {
    return Path.resolve(filePath)
  }

  // If there is no file extension then infer it (from given language) and return if
  // exists on file system. Otherwise consider file path as being to a folder that
  // mnust have an index file.

  const filePathWithExt = Path.resolve(filePath) + ext

  if (FS.existsSync(filePathWithExt)) {
    return filePathWithExt
  }

  return Path.join(Path.resolve(filePath), appendExt(ext, 'index'))
}

/**
 * Create a map of interface names to the path of the file in which they're defined
 * The first evaluated interfaces are always the chosen ones
 */
const getTypeToFileMapping = (
  files: NormalizedFile[],
  filesToTypesMap: FilesToTypesMap,
): InterfaceNamesToFile => {
  // REFACTOR: This function basically just takes an index and flips it. Make generic.
  const mapping: InterfaceNamesToFile = {}

  for (const file of files) {
    // WARNING: typesMap is not typesafe since the lookup could fail.
    const typesMap = filesToTypesMap[file.path]
    const interfaceNames = Object.keys(typesMap)

    for (const interfaceName of interfaceNames) {
      if (!mapping[interfaceName]) {
        mapping[interfaceName] = file
      }
    }
  }

  return mapping
}

/**
 * Replace all occurances of given search string in a given
 * string with another string.
 */
const replaceAll = (
  str: string,
  search: string,
  replacement: string,
): string => {
  return str.split(search).join(replacement)
}

/**
 * Return a new array whose items are a merger of the given two arrays.
 */
const concat = <T = unknown>(a: T[], b: T[]): T[] => {
  return a.concat(b)
}

// TODO Refactor; confusing; only one callsite
const uniq = <T = unknown>(value: T, index: number, array: T[]): boolean => {
  return array.indexOf(value) === index
}

type LanguageExtension = 'ts' | 'js'
const languageExtensions: LanguageExtension[] = ['ts', 'js']

const extToLangIndex: Record<'ts' | 'js', Language> = {
  ts: 'typescript',
  js: 'flow',
}

const getLangFromExt = (ext: LanguageExtension): Language => {
  return extToLangIndex[ext]
}

/**
 * Get the extension from a file name (or path with file name).
 * Unlike Path.extname this returns null if no ext can be extracted.
 */
const getExt = (path: string): null | string => {
  const ext = Path.extname(path)
  if (ext === '') return null
  const extWithoutDot = ext.slice(1)
  return extWithoutDot
}

/**
 * Predicate function for checking if a path is to file.
 * Relies on convention that a dot being present in last
 * path item is a file.
 *
 * Examples:
 *
 *    /a/b/c -> false
 *    /a/b/c.foo -> true
 */
const isFile = (path: string): boolean => {
  return Path.extname(path) !== ''
}

export {
  LanguageExtension,
  languageExtensions,
  getLangFromExt,
  getTypeToFileMapping,
  uniq,
  concat,
  replaceAll,
  upperFirst,
  normalizeFilePath,
  getExt,
  isFile,
}
