import * as exec from 'execa'

export async function commandExists(cmd: string): boolean {
  try {
    await exec(cmd)
  } catch (err) {
    return false
  }
}
