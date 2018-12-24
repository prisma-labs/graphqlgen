import * as Parse from '../../src/parse'
import * as Sys from '../lib/sys'

const log = console.log

const sdlFilePath = Sys.toAbsolutePath('./schema.graphql')
const schema = Parse.parseSchema(sdlFilePath)

const run = () => {
  log('will run basic bench')
  log(schema)
}

export { run }
