/*! select-1.1.0 2014-10-29 19:22:02 */
define("pandora/select/1.1.0/select-multi-item.handlebars",["gallery/handlebars/1.3.0/handlebars"],function(a,b,c){var d=a("gallery/handlebars/1.3.0/handlebars");c.exports=d.template(function(a,b,c,d,e){function f(a,b,d){var e,f,j="";return j+='\n<label title="',(f=c.text)?e=f.call(a,{hash:{},data:b}):(f=a&&a.text,e=typeof f===o?f.call(a,{hash:{},data:b}):f),j+=p(e)+'" class="item',e=c["if"].call(a,a&&a.selected,{hash:{},inverse:q.noop,fn:q.program(2,g,b),data:b}),(e||0===e)&&(j+=e),e=c["if"].call(a,a&&a.disabled,{hash:{},inverse:q.noop,fn:q.program(4,h,b),data:b}),(e||0===e)&&(j+=e),j+='" data-index="'+p((e=null==b||b===!1?b:b.index,typeof e===o?e.apply(a):e))+'" data-role="item" data-value="',(f=c.value)?e=f.call(a,{hash:{},data:b}):(f=a&&a.value,e=typeof f===o?f.call(a,{hash:{},data:b}):f),(e||0===e)&&(j+=e),j+='">\n  <input type="checkbox" data-text="',(f=c.text)?e=f.call(a,{hash:{},data:b}):(f=a&&a.text,e=typeof f===o?f.call(a,{hash:{},data:b}):f),(e||0===e)&&(j+=e),j+='" value="',(f=c.value)?e=f.call(a,{hash:{},data:b}):(f=a&&a.value,e=typeof f===o?f.call(a,{hash:{},data:b}):f),(e||0===e)&&(j+=e),j+='"',e=c["if"].call(a,a&&a.selected,{hash:{},inverse:q.noop,fn:q.program(6,i,b),data:b}),(e||0===e)&&(j+=e),e=c["if"].call(a,a&&a.disabled,{hash:{},inverse:q.noop,fn:q.program(4,h,b),data:b}),(e||0===e)&&(j+=e),j+='>\n  <span style="max-width: '+p((e=d&&d.maxWidth,typeof e===o?e.apply(a):e))+'">',(f=c.text)?e=f.call(a,{hash:{},data:b}):(f=a&&a.text,e=typeof f===o?f.call(a,{hash:{},data:b}):f),(e||0===e)&&(j+=e),j+="</span>\n</label>\n"}function g(){return" selected"}function h(){return" disabled"}function i(){return" checked"}this.compilerInfo=[4,">= 1.0.0"],c=c||{};for(var j in a.helpers)c[j]=c[j]||a.helpers[j];e=e||{};var k,l,m,n="",o="function",p=this.escapeExpression,q=this,r=c.blockHelperMissing;return m={hash:{},inverse:q.noop,fn:q.programWithDepth(1,f,e,b),data:e},(l=c.select)?k=l.call(b,m):(l=b&&b.select,k=typeof l===o?l.call(b,m):l),c.select||(k=r.call(b,k,{hash:{},inverse:q.noop,fn:q.programWithDepth(1,f,e,b),data:e})),(k||0===k)&&(n+=k),n+="\n"})});