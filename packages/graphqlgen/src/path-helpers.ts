import * as fs from 'fs';
import * as path from 'path'

// TODO write test cases
export function getAbsoluteFilePath(modelPath: string): string {
  let absolutePath = path.resolve(modelPath)

  if (!fs.existsSync(absolutePath) && fs.existsSync(`${absolutePath}.ts`)) {
    absolutePath += '.ts'
  }

  if (!fs.lstatSync(absolutePath).isDirectory()) {
    if (path.extname(absolutePath) !== '.ts') {
      throw new Error(`${absolutePath} has to be a .ts file`)
    }

    return absolutePath
  }

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`${absolutePath} not found`)
  }

  const indexTsPath = path.join(absolutePath, 'index.ts')
  if (!fs.existsSync(indexTsPath)) {
    throw new Error(`No index.ts file found in directory: ${absolutePath}`)
  }

  return indexTsPath
}

// TODO write test cases
export function getImportPathRelativeToOutput(
  absolutePath: string,
  outputDir: string,
): string {
  let relativePath = path.relative(path.dirname(outputDir), absolutePath)

  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath
  }

  // remove .ts file extension
  relativePath = relativePath.replace(/\.ts$/, '')

  // remove /index
  relativePath = relativePath.replace(/\/index$/, '')

  return relativePath
}