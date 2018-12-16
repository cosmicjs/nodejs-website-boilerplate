// contact.js
import axios from 'axios'
import async from 'async'
import _ from 'lodash'
module.exports = (app, config, partials) => {
  const bucket = config.bucket
  app.get('/contact', (req, res) => {
    bucket.getObjects().then(response => {
      const objects = response.objects
      res.locals.header = _.find(objects, { 'slug': 'header' })
      res.locals.nav = _.find(objects, { 'slug': 'nav' })
      res.locals.social = _.find(objects, { 'slug': 'social' })
      res.locals.contact_info = _.find(objects, { 'slug': 'contact-info' })
      res.locals.footer = _.find(objects, { 'slug': 'footer' })
      res.locals.page = _.find(objects, { 'slug': 'contact' })
      return res.render('contact.html', {
        partials
      })
    }).catch(error => {
      console.log(error)
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
    })
  })
  // Submit form
  app.post('/contact', (req, res) => {
    var data = req.body
    async.series([
      callback => {
        bucket.getObject({ slug: 'contact-form' }).then(response => {
          const object = response.object
          res.locals.contact_form = {
            to: object.metadata.to,
            subject: object.metadata.subject,
          }
          callback()
        }).catch(error => {
          console.log(error)
          return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
        })
      },
      callback => {
        var message = 'Name: ' + data.full_name + '\n\n' +
        'Subject: ' + res.locals.contact_form.subject + '\n\n' +
        'Message: ' + data.message + '\n\n'
        var email_data = {
          from: data.email,
          to: res.locals.contact_form.to,
          subject: data.full_name + ' sent you a new message: ' + data.message,
          text_body: message,
          html_body: message
        }
        const url = config.SENDGRID_FUNCTION_ENDPOINT
        axios.post(url, email_data)
          .then(function (response) {
            return callback()
          })
          .catch(function (error) {
            console.log(error)
            return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
          })
      },
      callback => {
        // Send to Cosmic
        const object = {
          type_slug: 'form-submissions',
          title: data.full_name,
          content: data.message,
          metafields: [
            {
              title: 'Email',
              key: 'email',
              type: 'text',
              value: data.email
            },
            {
              title: 'Phone',
              key: 'phone',
              type: 'text',
              value: data.phone
            }
          ]
        }
        // Write to Cosmic Bucket (Optional)
        bucket.addObject(object).then(response => {
          return res.json({ status: 'success', data: response })
        }).catch(function (error) {
          console.log(error)
          return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
        })
      }
    ])
  })
}
