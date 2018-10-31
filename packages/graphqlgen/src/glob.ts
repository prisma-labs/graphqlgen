import * as glob from 'glob'

/**
 * Returns path array from glob patterns
 */
export const extractPath = (paths?: string[]) => {
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
