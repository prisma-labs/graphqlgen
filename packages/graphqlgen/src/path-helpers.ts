import * as fs from 'fs'
import * as path from 'path'
import { Language } from 'graphqlgen-json-schema'

export function getExtNameFromLanguage(language: Language) {
  const extNames = {
    typescript: '.ts',
    flow: '.js'
  }

  return extNames[language]
}

export function getAbsoluteFilePath(
  modelPath: string,
  language: Language,
): string {
  let absolutePath = path.resolve(modelPath)
  const extName = getExtNameFromLanguage(language)

  if (
    !fs.existsSync(absolutePath) &&
    fs.existsSync(`${absolutePath}${extName}`)
  ) {
    absolutePath += extName
  }

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`${absolutePath} not found`)
  }

  if (!fs.lstatSync(absolutePath).isDirectory()) {
    if (path.extname(absolutePath) !== extName) {
      throw new Error(`${absolutePath} has to be a ${extName} file`)
    }

    return absolutePath.replace(/\\/g, '/')
  }

  const indexPath = path.join(absolutePath, 'index' + extName)
  if (!fs.existsSync(indexPath)) {
    throw new Error(
      `No index${extName} file found in directory: ${absolutePath}`,
    )
  }

  return indexPath.replace(/\\/g, '/')
}

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

  // replace \ with /
  relativePath = relativePath.replace(/\\/g, '/')

  return relativePath
}
