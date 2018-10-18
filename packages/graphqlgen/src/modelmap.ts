import { ModelMap } from './types'
import {
  getAbsoluteFilePath,
  getImportPathRelativeToOutput,
} from './path-helpers'

interface ModelsConfig {
  [typeName: string]: string
}

export function buildModelMap(
  modelsConfig: ModelsConfig,
  outputDir: string,
): ModelMap {
  return Object.keys(modelsConfig).reduce((acc, typeName) => {
    const modelConfig = modelsConfig[typeName]
    const [modelPath, modelTypeName] = modelConfig.split(':')
    const absoluteFilePath = getAbsoluteFilePath(modelPath)
    const importPathRelativeToOutput = getImportPathRelativeToOutput(
      absoluteFilePath,
      outputDir,
    )
    return {
      ...acc,
      [typeName]: {
        absoluteFilePath,
        importPathRelativeToOutput,
        modelTypeName,
      },
    }
  }, {})
}
