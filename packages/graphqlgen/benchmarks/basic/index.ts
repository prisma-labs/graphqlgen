import * as Parse from '../../src/parse'
import * as Sys from '../lib/sys'

const log = console.log

const language = 'typescript'
const sdlFilePath = Sys.toAbsolutePath('./schema.graphql')
const schema = Parse.parseSchema(sdlFilePath)
const models = Sys.toAbsolutePath('./models.ts')

const run = () => {
  log('will run basic bench')
  log(schema)
  log(language)
  log(models)
}

export { run }
