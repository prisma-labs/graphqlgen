import * as glob from 'glob'
import { File } from 'graphqlgen-json-schema'
import { getPath } from './parse'

/**
 * Returns the path array from glob patterns
 */
export const extractGlobPattern = (file: File) => {
  return glob.sync(getPath(file))
}

/**
 * Handles the glob pattern of models.files
 */
export const handleGlobPattern = (files?: File[]): File[] => {
  if (!files) {
    return []
  }

  return files.reduce<File[]>((acc, file) => {
    const globedPaths = extractGlobPattern(file)

    if (globedPaths.length === 0) {
      return [...acc, file]
    }

    const globedFiles: File[] = globedPaths.map(path => {
      if (typeof file === 'string') {
        return path
      }

      return {
        path,
        defaultName: file.defaultName
      }
    })

    return [...acc, ...globedFiles]
  }, [])
}
