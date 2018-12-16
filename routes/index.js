// Routes
module.exports = (app, config, partials, _) => {
  require('./home')(app, config, partials, _)
  require('./blog')(app, config, partials, _)
  require('./contact')(app, config, partials, _)
  require('./search')(app, config, partials, _)
  require('./faqs')(app, config, partials, _)
  require('./page')(app, config, partials, _)
  require('./404')(app, config, partials, _)
}