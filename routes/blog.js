// blog.js
import Cosmic from 'cosmicjs'
module.exports = (app, config, partials) => {
  app.get('/blog', (req, res) => {
    Cosmic.getObjects({ bucket: { slug: config.COSMIC_BUCKET, read_key: config.COSMIC_READ_KEY } }, (err, response) => {
      res.locals.cosmic = response
      const page = response.object.blog
      const blogs = response.objects.type.blogs
      res.locals.page = page
      res.locals.blogs = blogs
      blogs.forEach((blog, i) => {
        blogs[i].timestamp = new Date(blog.created).getTime()
      })
      return res.render('blog.html', {
        partials
      })
    })
  })
  app.get('/blog/:slug', (req, res) => {
    const slug = req.params.slug
    Cosmic.getObjects({ bucket: { slug: config.COSMIC_BUCKET, read_key: config.COSMIC_READ_KEY } }, (err, response) => {
      res.locals.cosmic = response
      const blogs = response.objects.type.blogs
      blogs.forEach(page => {
        if (page.slug === slug)
          res.locals.page = page
      })
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
