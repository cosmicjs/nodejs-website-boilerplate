// page.js
module.exports = (app, config, bucket, partials, _) => {
  app.get('/:slug', async (req, res) => {
    const slug = req.params.slug
   try {
      const response = await bucket.getObjects()
      const objects = response.objects
      res.locals.globals = require('../helpers/globals')(objects, _)
      const page = _.find(objects, { 'slug': slug })
      res.locals.page = page
      if (!res.locals.page) {
        res.locals.page = _.find(objects, { 'slug': '404-page-not-found' })
        return res.status(404).render('404.html', {
          partials
        })  
      }
      return res.render('page.html', {
        partials
      })
    } catch(error) {
      console.log(error)
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
    }
  })
}
