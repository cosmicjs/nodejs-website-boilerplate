// page.js
module.exports = (app, config, partials, _) => {
  app.get('/:slug', (req, res) => {
    const bucket = config.bucket
    const slug = req.params.slug
    bucket.getObjects().then(response => {
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
    }).catch(error => {
      console.log(error)
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
    })
  })
}
