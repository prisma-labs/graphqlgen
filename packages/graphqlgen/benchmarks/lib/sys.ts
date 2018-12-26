import * as FS from 'fs'
import * as Path from 'path'
import * as getCallSite from 'callsite'

const path = (...segments: string[]): string => {
  return Path.join.apply(null, segments)
}

const read = (relativePath: string): string => {
  const absolutePath = toAbsolutePathRelativeToDefinition(relativePath)
  const contents = FS.readFileSync(absolutePath, 'utf8')
  return contents
}

const toAbsolutePathRelativeToDefinition = (relativePath: string): string => {
  const stack = getCallSite()
  const callerSite = stack[1]
  const callerPath = callerSite.getFileName()
  const basePath = Path.dirname(callerPath)
  return Path.join(basePath, relativePath)
}

const toAbsolutePathRelativeToCaller = (relativePath: string): string => {
  const stack = getCallSite()
  const callerSite = stack[2]
  const callerPath = callerSite.getFileName()
  const basePath = Path.dirname(callerPath)
  return Path.join(basePath, relativePath)
}

export {
  read,
  toAbsolutePathRelativeToDefinition as toAbsolutePath,
  toAbsolutePathRelativeToCaller,
  path,
}
