import * as glob from 'glob'
import { File } from 'graphqlgen-json-schema'

/**
 * Returns the path array from glob patterns
 */
export const extractGlobPattern = (paths?: string[]) => {
  try {
    const pathArr: string[] = []
    if (paths) {
      paths.map(p => {
        pathArr.push(...glob.sync(p))
      })
    }
    return pathArr
  } catch (error) {
    console.log(error)
  }
}

/**
 * Handles the glob pattern of models.files
 */
export const handleGlobPattern = (files?: File[]): File[] => {
  try {
    const newFiles: File[] = []

    if (files) {
      files.map(file => {
        if (typeof file === 'string') {
          newFiles.push(...extractGlobPattern([file])!)
        } else {
          newFiles.push(file)
        }
      })
    }

    return newFiles
  } catch (error) {
    console.log(error)
    process.exit(1)
    return []
  }
}
