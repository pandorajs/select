var alias = {
  '$': 'jquery/jquery/2.1.0/jquery',
  'widget': 'pandora/widget/1.0.0/widget',
  'expect': 'gallery/expect/0.2.0/expect',
  'handlebars': 'gallery/handlebars/1.3.0/handlebars'
}
var base = '/base/sea-modules';
// src alias
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/\/src\//.test(file)) {
      var match = file.match(/\/src\/([^.]+)\.js/);
      if (match !== null) {
        alias[match[1]] = file;
      }
    }
  }
}
seajs.config({
  base: base,
  alias: alias
})

var _fn = window.__karma__.start;
window.__karma__.start = function() {
  seajs.use(['./base/test/select-spec.js'], function() {
    _fn.call();
    //QUnit.start();
  });
}
