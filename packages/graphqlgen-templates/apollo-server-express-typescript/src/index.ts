import * as express from 'express'
import { resolvers } from './graphql'
import { data } from './data'

const app = express()
const PORT = process.env.PORT | 5000

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}`)
})
