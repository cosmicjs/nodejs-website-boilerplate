// Config
module.exports = (app, config, partials) => {
  require('./home')(app, config, partials)
  require('./blog')(app, config, partials)
  require('./contact')(app, config, partials)
  require('./search')(app, config, partials)
  require('./faqs')(app, config, partials)
  require('./page')(app, config, partials)
  require('./404')(app, config, partials)
}