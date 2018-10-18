import { Language } from 'graphqlgen-json-schema'

import { ModelMap } from './types'
import {
  getAbsoluteFilePath,
  getImportPathRelativeToOutput,
} from './path-helpers'

export interface ModelsConfig {
  [typeName: string]: string
}

export function buildModelMap(
  modelsConfig: ModelsConfig,
  outputDir: string,
  language: Language
): ModelMap {
  return Object.keys(modelsConfig).reduce((acc, typeName) => {
    const modelConfig = modelsConfig[typeName]
    const [filePath, modelName] = modelConfig.split(':')
    const absoluteFilePath = getAbsoluteFilePath(filePath, language)
    const importPathRelativeToOutput = getImportPathRelativeToOutput(
      absoluteFilePath,
      outputDir,
    )
    return {
      ...acc,
      [typeName]: {
        absoluteFilePath,
        importPathRelativeToOutput,
        modelTypeName: modelName,
      },
    }
  }, {})
}
