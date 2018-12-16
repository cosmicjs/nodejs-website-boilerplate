// contact.js
import axios from 'axios'
import async from 'async'
module.exports = (app, config, bucket, partials, _) => {
  app.get('/contact', async (req, res) => {
    try {
      const response = await bucket.getObjects()
      const objects = response.objects
      res.locals.globals = require('../helpers/globals')(objects, _)
      res.locals.page = _.find(objects, { 'slug': 'contact' })
      return res.render('contact.html', {
        partials
      })
    } catch(error) {
      console.log(error)
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
    }
  })
  // Submit form
  app.post('/contact', async (req, res) => {
    var data = req.body
    try {
      const response = await bucket.getObject({ slug: 'contact-form' })
      const object = response.object
      const contact_form = {
        to: object.metadata.to,
        subject: object.metadata.subject,
      }
      var message = 'Name:<br>' + data.full_name + '<br><br>' +
      'Subject:<br>' + contact_form.subject + '<br><br>' +
      'Message:<br>' + data.message + '<br><br>'
      var email_data = {
        from: data.email,
        to: contact_form.to,
        subject: data.full_name + ' sent you a new message: ' + data.message,
        text_body: message,
        html_body: message
      }
      const url = config.SENDGRID_FUNCTION_ENDPOINT
      await axios.post(url, email_data)
      // Send to Cosmic
      const new_object = {
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
      const new_object_response = await bucket.addObject(new_object)
      return res.json({ status: 'success', data: new_object_response })
    } catch(error) {
      console.log(error)
      return res.status(500).send({ "status": "error", "message": "Yikes, something went wrong!" })
    }
  })
}
