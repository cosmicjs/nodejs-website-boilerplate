// search.js
import Cosmic from 'cosmicjs'
import _ from 'lodash'
module.exports = (app, config, partials) => {
  app.get('/search', (req, res) => {
    Cosmic.getObjects({ bucket: { slug: config.COSMIC_BUCKET, read_key: config.COSMIC_READ_KEY } }, (err, response) => {
      res.locals.cosmic = response
      if (req.query.q) {
        res.locals.q = req.query.q
        const q = req.query.q.toLowerCase()
        const objects = [
          ...response.objects.type.pages,
          ...response.objects.type.blogs
        ]
        let search_results = []
        objects.forEach(object => {
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
      const page = response.object.search
      res.locals.page = page
      return res.render('search.html', {
        partials
      })
    })
  })
}
