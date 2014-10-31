/*! widget-1.0.0 2014-09-12 17:20:26 */
define("pandora/widget/1.0.0/widget",["$","pandora/base/1.0.0/base","pandora/class/1.0.0/class","pandora/events/1.0.0/events","./append","./autorender","./daparser"],function(a,b,c){"use strict";function d(a,b){var c;for(c in a)b.call(null,c,a[c])}var e=a("$"),f=a("pandora/base/1.0.0/base"),g=a("./append"),h=/\{\{(.+?)\}\}/g,i=/^(\S+)\s*(.*)$/,j=".delegate-widget-",k="data-widget-uid",l={},m=f.extend({initialize:function(){var a=this;m.superclass.initialize.apply(a,arguments),a.uniqueId=n(),a.delegateNS=j+a.uniqueId,a.initCnE(),a.initDelegates(),a.setup(),l[a.uniqueId]=a},defaults:{container:"body",classPrefix:"ue-component",contentRole:"content",css:{},attr:{},template:null,templateOptions:null,data:{},delegates:null,element:"<div></div>",insert:function(){this.container.length&&this.container.append(this.element)}},$:function(a){return a?this.element.find(a):this.element},css:function(){return this.element.css.apply(this.element,arguments)},attr:function(){return this.element.attr.apply(this.element,arguments)},role:function(a){return this.$(a.replace(/(?:^\b|\s*,\s*)([_0-9a-zA-Z\-]+)/g,',[data-role="$1"]').substring(1))},data:function(a,b,c){return this.option(a,b,"data",c)},initCnE:function(){return this.container=e(this.option("container")),this.element=e(this.option("element")).attr(k,this.uniqueId).data("widget",this),this},initDnV:function(){return this.document=this.element.prop("ownerDocument")||this.element[0],this.viewport=function(a){return a.defaultView||a.parentWindow}(this.document),this},initDelegates:function(a,b){var c=this;return a||(a=c.option("delegates")),a?("function"==typeof a&&(a=a.call(c)),b=b?e(b):c.element,d(a,function(a,d){var e=a.replace(h,function(a,b){return c.option(b)||""}).match(i),f=e[1]+c.delegateNS;"string"==typeof d&&(d=c[d]),e[2]?b.on(f,e[2],function(){d.apply(c,arguments)}):b.on(f,function(){d.apply(c,arguments)})}),c):c},initTrigger:function(a){var b=this,c={};return a||(a=b.option("trigger")),a?(c["click "+a]=function(a){a.preventDefault(),a.stopPropagation(),b.activeTrigger=a.currentTarget,b.show()},b.initDelegates(c,b.document),b.element.hide(),b):b},setup:function(){},render:function(){var a,b=this,c=b.option("template"),d=b.option("children");return b.element.addClass(b.option("classPrefix")).css(b.option("css")||{}).attr(b.option("attr")||{}),a="function"==typeof c?c(b.data(),b.option("templateOptions")):b.option("content"),"undefined"!=typeof a&&b.element.html(a),d&&(b.rendered||b.initDnV(),g(b,d)),b.rendered||(b.option("insert").call(b),b.initDnV(),b.initTrigger(),b.rendered=!0),b.fire("render"),b},is:function(a){return this.element.is(a)},show:function(a){return a?this.on("show",a):this.element?(this.element.show(),this.fire("show"),this):this},hide:function(a){return a?this.on("hide",a):this.element?(this.element.hide(),this.fire("hide"),this):this},destroy:function(a){return a?this.on("destroy",a):(this.fire("destroy"),this.element&&(this.element.add(this.document).add(this.viewport).off(this.delegateNS),this.element.remove()),void m.superclass.destroy.apply(this))},getWidget:function(a){return m.get(a)}}),n=function(){var a={};return function(){var b=Math.random().toString(36).substr(2);return a[b]?n():(a[b]=!0,b)}}();e(window).unload(function(){var a;for(a in l)l[a].destroy()}),m.get=function(a){var b;return a=e(a).eq(0),a.length&&(b=a.attr(k)),l[b]},m.autoRender=a("./autorender"),c.exports=m}),define("pandora/widget/1.0.0/append",[],function(a,b,c){"use strict";c.exports=function(a,b){function c(){var b=a.document.createElement("div");return e[0].appendChild(b),b}function d(){var a=this["dummy"+i];a.parentNode.replaceChild(this.element[0],a)}var e,f,g,h,i=a.uniqueId;if(b)for(e=a.role(a.option("contentRole")),0===e.length&&(e=a.element),f=0,g=b.length;g>f;f++)h=b[f],h.rendered?e.append(h.element):(h["dummy"+i]=c(),h.once("render",d)),h.parentWidget=a}}),define("pandora/widget/1.0.0/autorender",["$","pandora/widget/1.0.0/daparser"],function(a,b,c){"use strict";function d(a){return"off"===a.getAttribute(h)}var e=a("$"),f=a("pandora/widget/1.0.0/daparser"),g="data-widget",h="data-widget-api",i="data-widget-auto-rendered",j="data-widget-role";c.exports=function(a,b){var c=[],h=[];return"function"==typeof a&&(b=a,a=null),a||(a=document.body),a instanceof e||(a=e(a)),d(a[0])?void(b&&b(-1)):(a.find("["+g+"]").each(function(a,b){var e;b.getAttribute(i)||(e=b.getAttribute(g).toLowerCase(),seajs.data.alias[e]&&(d(b)||(c.push(e),h.push(b))))}),c.length?void seajs.use(c,function(){var a,c,d,e=arguments.length;for(a=0;e>a;a++)c=h[a],d=f(c),d[c.getAttribute(j)||"element"]=c,new arguments[a](d),c.setAttribute(i,"true");b&&b(1)}):void(b&&b(0)))}}),define("pandora/widget/1.0.0/daparser",["$"],function(a,b,c){"use strict";function d(a){return a.toLowerCase().replace(o,function(a,b){return(b+"").toUpperCase()})}function e(a){return a.replace(/^[A-Z]/,function(a){return a.toLowerCase()})}function f(a){var b,c;for(b in a)if(a.hasOwnProperty(b)){if(c=a[b],"string"!=typeof c)continue;a[b]=p.test(c)?f(q(c.replace(/'/g,'"'))):g(c)}return a}function g(a){if("false"===a.toLowerCase())a=!1;else if("true"===a.toLowerCase())a=!0;else if(/\d/.test(a)&&/[^a-z]/i.test(a)){var b=parseFloat(a);b+""===a&&(a=b)}return a}function h(a){var b,c,d={};for(b in a)0===b.indexOf(m)&&(c=b.substring(n),c&&(d[e(c)]=a[b]));return d}function i(a){var b,c,e,f={},g=a.attributes,h=g.length;for(b=0;h>b;b++)c=g[b],e=c.name,0===e.indexOf(k)&&(e=e.substring(l),e&&(f[d(e)]=c.value));return f}var j=a("$"),k="data-widget-",l=12,m="widget",n=6,o=/-([a-z])/g,p=/^\s*[\[{].*[\]}]\s*$/,q=window.JSON?JSON.parse:j.parseJSON;c.exports=function(a,b){var c={};return c=a.dataset?h(a.dataset):i(a),b?c:f(c)}});