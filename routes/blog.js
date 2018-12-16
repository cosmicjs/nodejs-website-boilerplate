// blog.js
module.exports = (app, config, partials, _) => {
  const bucket = config.bucket
  app.get('/blog', (req, res) => {
    bucket.getObjects().then(response => {
      const objects = response.objects
      res.locals.globals = require('../helpers/globals')(objects, _)
      const page = _.find(objects, { 'slug': 'blog' })
      res.locals.page = page
      const blogs = _.filter(objects, { 'type_slug': 'blogs' })
      blogs.forEach((blog, i) => {
        blogs[i].timestamp = new Date(blog.created).getTime()
      })
      res.locals.blogs = blogs
      return res.render('blog.html', {
        partials
      })
    }).catch(error => {
      console.log(error)
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
    })
  })
  app.get('/blog/:slug', (req, res) => {
    const slug = req.params.slug
    bucket.getObjects().then(response => {
      const objects = response.objects
      res.locals.globals = require('../helpers/globals')(objects, _)
      const page = _.find(objects, { slug })
      if (!page) {
        res.locals.page = _.find(objects, { 'slug': '404-page-not-found' })
        return res.status(404).render('404.html', {
          partials
        })  
      }
      res.locals.page = page
      res.locals.page.timestamp = new Date(res.locals.page.created).getTime()
      if (!res.locals.page) {
        return res.status(404).render('404.html', {
          partials
        })  
      }
      return res.render('blog-single.html', {
        partials
      })
    })
  })
}
