// 404
import Cosmic from 'cosmicjs'
module.exports = (app, config, partials) => {
  // 404
  app.get('/:slug', (req, res) => {
    Cosmic.getObjects({ bucket: { slug: config.COSMIC_BUCKET, read_key: config.COSMIC_READ_KEY } }, (err, response) => {
      res.locals.cosmic = response
      res.error('404.html')
    })
  })
}