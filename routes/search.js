// search.js
module.exports = (app, config, bucket, partials, _) => {
  app.get('/search', async (req, res) => {
    try {
      const response = await bucket.getObjects()
      const objects = response.objects
      const searchable_objects = [
        ..._.filter(objects, { type_slug: 'pages' }),
        ..._.filter(objects, { type_slug: 'blogs' })
      ]
      res.locals.globals = require('../helpers/globals')(objects, _)
      const page = _.find(objects, { 'slug': 'search' })
      res.locals.page = page
      if (req.query.q) {
        res.locals.q = req.query.q
        const q = req.query.q.toLowerCase()
        let search_results = []
        searchable_objects.forEach(object => {
          if(object.title.toLowerCase().indexOf(q) !== -1 || object.content.toLowerCase().indexOf(q) !== -1) {
            object.teaser = object.content.replace(/(<([^>]+)>)/ig,"").substring(0, 300)
            if (object.type_slug === 'blogs')
              object.permalink = '/blog/' + object.slug
            else
              object.permalink = '/' + object.slug
            search_results.push(object)
          }
          if (!_.find(search_results, { _id: object._id })) {
            object.metafields.forEach(metafield => {
              if(metafield.value.toLowerCase().indexOf(q) !== -1 && !_.find(search_results, { _id: object._id })) {
                object.teaser = object.content.replace(/(<([^>]+)>)/ig,"").substring(0, 300)
                if (object.type_slug === 'blogs')
                  object.permalink = '/blog/' + object.slug
                else
                  object.permalink = '/' + object.slug
                search_results.push(object)
              } 
            })
          }
        })
        res.locals.search_results = search_results
      }
      return res.render('search.html', {
        partials
      })
    } catch(error) {
      console.log(error)
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
    }
  })
}
