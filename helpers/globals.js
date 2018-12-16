const globals = (objects, _) => {
  const globals = {}
  globals.header = _.find(objects, { 'slug': 'header' })
  globals.nav = _.find(objects, { 'slug': 'nav' })
  globals.social = _.find(objects, { 'slug': 'social' })
  globals.contact_info = _.find(objects, { 'slug': 'contact-info' })
  globals.footer = _.find(objects, { 'slug': 'footer' })
  return globals
}
module.exports = globals