// app-server.js
import express from 'express'
import hogan from 'hogan-express'
import http_module from 'http'
import bodyParser from 'body-parser'
import compression from 'compression'
import _ from 'lodash'
import config from './config'
import Cosmic from 'cosmicjs'
const api = Cosmic()
const bucket = api.bucket({
  slug: config.COSMIC_BUCKET,
  read_key: config.COSMIC_READ_KEY,
  write_key: config.COSMIC_WRITE_KEY
})
const app = express()
app.use(bodyParser.json())
app.use(compression())
app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.set('port', process.env.PORT || 3000)
app.use(express.static(__dirname + '/public'))
app.use((req, res, next) => {
  if (req.url === '/favicon.ico')
    return res.end()
  // Set global variables
  res.locals.year = new Date().getFullYear()
  // Set dev
  if (process.env.NODE_ENV === 'development')
    res.locals.is_dev = true
  next()
})
const partials = {
  header: 'partials/header',
  footer: 'partials/footer'
}
require('./routes')(app, config, bucket, partials, _)
const http = http_module.Server(app)
http.listen(app.get('port'), () => {
  console.info('==> 🌎  Go to http://localhost:%s', app.get('port'));
})