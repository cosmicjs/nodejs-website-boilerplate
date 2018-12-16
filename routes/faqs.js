// faqs.js
module.exports = (app, config, partials, _) => {
  const bucket = config.bucket
  app.get('/faqs', (req, res) => {
    bucket.getObjects().then(response => {
      const objects = response.objects
      res.locals.globals = require('../helpers/globals')(objects, _)
      const page = _.find(objects, { 'slug': 'faqs' })
      res.locals.page = page
      return res.render('faqs.html', {
        partials
      })
    }).catch(error => {
      console.log(error)
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
    })
  })
}
