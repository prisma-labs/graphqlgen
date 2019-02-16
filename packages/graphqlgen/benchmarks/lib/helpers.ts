import * as FS from 'fs'
import * as CP from 'child_process'

/**
 * Return the latest git revision id.
 */
const getGitHeadSha = (): string => {
  return CP.execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
}

/**
 * Helper to update a json file. User needs only update the passed object.
 */
const updateJSONFile = <T extends unknown>(
  path: string,
  updater: (data: T) => T,
): void => {
  const data: T = JSON.parse(FS.readFileSync(path, 'utf8'))
  const updatedData = updater(data)
  FS.writeFileSync(path, JSON.stringify(updatedData, null, 2))
}

export { getGitHeadSha, updateJSONFile }
