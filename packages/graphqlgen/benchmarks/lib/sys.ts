import * as FS from 'fs'
import * as Path from 'path'
import * as getCallSite from 'callsite'

const read = (relativePath: string): string => {
  const absolutePath = toAbsolutePath(relativePath)
  const contents = FS.readFileSync(absolutePath, 'utf8')
  return contents
}

const toAbsolutePath = (relativePath: string): string => {
  const stack = getCallSite()
  const callerSite = stack[1]
  const callerPath = callerSite.getFileName()
  const basePath = Path.dirname(callerPath)
  return Path.join(basePath, relativePath)
}

export { read, toAbsolutePath }
