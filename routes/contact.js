// contact.js
import Cosmic from 'cosmicjs'
import nodemailer from 'nodemailer'
import async from 'async'
import _ from 'lodash'
module.exports = (app, config, partials) => {
  app.get('/contact', (req, res) => {
    const slug = 'contact'
    Cosmic.getObjects({ bucket: { slug: config.COSMIC_BUCKET, read_key: config.COSMIC_READ_KEY } }, (err, response) => {
      res.locals.cosmic = response
      const pages = response.objects.type.pages
      pages.forEach(page => {
        if (page.slug === slug)
          res.locals.page = page
      })
      return res.render('contact.html', {
        partials
      })
    })
  })
  // Submit form
  app.post('/contact', (req, res) => {
    var data = req.body
    async.series([
      callback => {
        Cosmic.getObject({ bucket: { slug: config.COSMIC_BUCKET } }, { slug: 'contact-form' }, (err, response) => {
          const object = response.object
          res.locals.contact_form = {
            to: _.find(object.metafields, { key: 'to' }).value,
            subject: _.find(object.metafields, { key: 'subject' }).value,
          }
          callback()
        })
      },
      callback => {
        var api_key = process.env.MAILGUN_KEY // add mailgun key
        var domain = process.env.MAILGUN_DOMAIN // add mailgun domain
        if (!api_key || !domain)
          return res.status(500).send({ "status": "error", "message": "You must add a MailGun api key and domain using environment variables located in Your Cosmic JS Bucket > Deploy to Web.  Contact your developer to add these values." });
        var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain })
        var message = 'Name: ' + data.full_name + '\n\n' +
        'Subject: ' + res.locals.contact_form.subject + '\n\n' +
        'Message: ' + data.message + '\n\n'
        var mailgun_data = {
          from: 'Your Website <me@' + domain + '>',
          to: res.locals.contact_form.to,
          subject: data.full_name + ' sent you a new message: ' + data.message,
          text: message
        }
        mailgun.messages().send(mailgun_data, function (error, body) {
          if (error)
            return res.status(500).send({ "status": "error", "message": "You must add a MailGun api key and domain using environment variables located in Your Cosmic JS Bucket > Deploy to Web.  Contact your developer to add these values." });
          callback()
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
        if (config.COSMIC_WRITE_KEY)
          object.write_key = config.COSMIC_WRITE_KEY
        // Write to Cosmic Bucket (Optional)
        Cosmic.addObject({ bucket: { slug: config.COSMIC_BUCKET, write_key: config.COSMIC_WRITE_KEY } }, object, (err, response) => {
          return res.json({ status: 'success', data: response })
        })
      }
    ])
  })
}
