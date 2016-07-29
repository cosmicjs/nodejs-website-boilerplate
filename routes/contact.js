// contact.js
import Cosmic from 'cosmicjs'
import nodemailer from 'nodemailer'
import async from 'async'
import _ from 'lodash'
module.exports = (app, config, partials) => {
  app.get('/contact', (req, res) => {
    const slug = 'contact'
    Cosmic.getObjects({ bucket: { slug: config.COSMIC_BUCKET } }, (err, response) => {
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
    const data = req.body
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
        // Send to email
        let text_body = res.locals.contact_form.subject + '<br />'
        text_body += 'Email: ' + data.email + '<br />'
        text_body += 'Phone: ' + data.phone + '<br />'
        text_body += 'Message: <br />' + data.message + '<br /><br />'
        text_body += 'Login to your Cosmic JS bucket dashboard to view your form submissions: https://cosmicjs.com<br />'
        if (!config.SMTPS_STRING)
          return res.status(500).send({ "status": "error", "message": "Email not sent.  You need to add the smtps string to your config." })
        const transporter = nodemailer.createTransport(config.SMTPS_STRING);
        var mailOptions = {
          from: 'Cosmic JS <support@cosmicjs.com>', // sender address
          to: res.locals.contact_form.to, // list of receivers
          subject: res.locals.contact_form.subject, // Subject line
          text: text_body, // plaintext body
          html: text_body // html body
        }
        // Send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
            console.log(error)
            return res.status(500).send({ "status": "error", "message": "Email not sent.  You need to add the smtps string to your config." })
          } else {
            callback()
          }
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
        Cosmic.addObject({ bucket: { slug: config.COSMIC_BUCKET } }, object, (err, response) => {
          if (err)
            res.status(500).json({ status: 'error', data: response })
          else
            res.json({ status: 'success', data: response })
          res.end()
        })
      }
    ])
  })
}
