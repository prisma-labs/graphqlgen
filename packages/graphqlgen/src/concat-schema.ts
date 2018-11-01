import chalk from 'chalk'
import * as fs from 'fs'
import { GraphQLGenDefinition } from 'graphqlgen-json-schema'
import * as mkdirp from 'mkdirp'
import * as path from 'path'

import { extractGlobPattern } from './glob'

export const readSchemaSync = (schemaDir: string) => {
  try {
    const schemas = extractGlobPattern([schemaDir])

    if (schemas) {
      return schemas
        .map(f => {
          return fs.readFileSync(f).toString()
        })
        .join('\n')
    }
  } catch (error) {
    console.log(error)
  }
}

export const generateSchema = (config: GraphQLGenDefinition) => {
  const data = readSchemaSync(config.schema)

  const outputPath = path.join(process.cwd(), config['schema-output'])

  // Create generation target folder, if it does not exist
  mkdirp.sync(path.dirname(outputPath))

  try {
    console.log(chalk.cyan('Generating new schema :', outputPath))
    fs.writeFileSync(outputPath, data, { flag: 'w' })
    return true
  } catch (error) {
    console.log(error)
    return error
  }
}
