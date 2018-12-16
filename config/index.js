// config
const api = require('cosmicjs')()
const config = require('./' + process.env.NODE_ENV)
const bucket = api.bucket({
  slug: config.default.COSMIC_BUCKET,
  read_key: config.default.COSMIC_READ_KEY,
  write_key: config.default.COSMIC_WRITE_KEY
})
module.exports = config
module.exports = bucket