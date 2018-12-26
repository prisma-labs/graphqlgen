import * as Path from 'path'
import * as getCallSite from 'callsite'
import * as Glob from 'glob'

const toAbsolutePathRelativeToCaller = (relativePath: string): string => {
  const stack = getCallSite()
  const callerSite = stack[2]
  const callerPath = callerSite.getFileName()
  const basePath = Path.dirname(callerPath)
  return Path.join(basePath, relativePath)
}

const globRelative = (relativeGlob: string): string[] => {
  return Glob.sync(toAbsolutePathRelativeToCaller(relativeGlob))
}

const glob = (pathPattern: string): string[] => {
  return Glob.sync(pathPattern)
}

export { glob, globRelative, toAbsolutePathRelativeToCaller }
