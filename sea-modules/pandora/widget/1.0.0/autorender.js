/*! widget-1.0.0 2014-09-12 17:20:26 */
define("pandora/widget/1.0.0/autorender",["$","./daparser"],function(a,b,c){"use strict";function d(a){return"off"===a.getAttribute(h)}var e=a("$"),f=a("./daparser"),g="data-widget",h="data-widget-api",i="data-widget-auto-rendered",j="data-widget-role";c.exports=function(a,b){var c=[],h=[];return"function"==typeof a&&(b=a,a=null),a||(a=document.body),a instanceof e||(a=e(a)),d(a[0])?void(b&&b(-1)):(a.find("["+g+"]").each(function(a,b){var e;b.getAttribute(i)||(e=b.getAttribute(g).toLowerCase(),seajs.data.alias[e]&&(d(b)||(c.push(e),h.push(b))))}),c.length?void seajs.use(c,function(){var a,c,d,e=arguments.length;for(a=0;e>a;a++)c=h[a],d=f(c),d[c.getAttribute(j)||"element"]=c,new arguments[a](d),c.setAttribute(i,"true");b&&b(1)}):void(b&&b(0)))}}),define("pandora/widget/1.0.0/daparser",["$"],function(a,b,c){"use strict";function d(a){return a.toLowerCase().replace(o,function(a,b){return(b+"").toUpperCase()})}function e(a){return a.replace(/^[A-Z]/,function(a){return a.toLowerCase()})}function f(a){var b,c;for(b in a)if(a.hasOwnProperty(b)){if(c=a[b],"string"!=typeof c)continue;a[b]=p.test(c)?f(q(c.replace(/'/g,'"'))):g(c)}return a}function g(a){if("false"===a.toLowerCase())a=!1;else if("true"===a.toLowerCase())a=!0;else if(/\d/.test(a)&&/[^a-z]/i.test(a)){var b=parseFloat(a);b+""===a&&(a=b)}return a}function h(a){var b,c,d={};for(b in a)0===b.indexOf(m)&&(c=b.substring(n),c&&(d[e(c)]=a[b]));return d}function i(a){var b,c,e,f={},g=a.attributes,h=g.length;for(b=0;h>b;b++)c=g[b],e=c.name,0===e.indexOf(k)&&(e=e.substring(l),e&&(f[d(e)]=c.value));return f}var j=a("$"),k="data-widget-",l=12,m="widget",n=6,o=/-([a-z])/g,p=/^\s*[\[{].*[\]}]\s*$/,q=window.JSON?JSON.parse:j.parseJSON;c.exports=function(a,b){var c={};return c=a.dataset?h(a.dataset):i(a),b?c:f(c)}});