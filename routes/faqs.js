// faqs.js
import Cosmic from 'cosmicjs'
module.exports = (app, config, partials) => {
  app.get('/faqs', (req, res) => {
    Cosmic.getObjects({ bucket: { slug: config.COSMIC_BUCKET, read_key: config.COSMIC_READ_KEY } }, (err, response) => {
      res.locals.cosmic = response
      const page = response.object.faqs
      res.locals.page = page
      return res.render('faqs.html', {
        partials
      })
    })
  })
}
