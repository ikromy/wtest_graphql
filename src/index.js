const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet'); 
const graphqlHttp = require('express-graphql')
const config = require('./config')
const wlSchema = require('./schema')

app.use(bodyParser.json())
app.use(cors())
app.use(helmet())

app.use('/graphql', graphqlHttp({
  schema: wlSchema,
  graphiql: true
}))

app
  .listen(config.server.port, () => {
    console.log(`App listen on ${config.server.port}`)
  })
