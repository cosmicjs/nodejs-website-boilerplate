// home.js
module.exports = (app, config, bucket, partials, _) => {
  app.get('/', async (req, res) => {
    try {
      const response = await bucket.getObjects()
      const objects = response.objects
      res.locals.globals = require('../helpers/globals')(objects, _)
      const page = _.find(objects, { 'slug': 'home' })
      res.locals.page = page
      const carousel_items = page.metadata.carousel
      carousel_items.forEach((item, i) => {
        if (i === 0)
          item.is_first = true
        item.index = i
      })
      return res.render('index.html', {
        partials
      })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
    }
  })
}
