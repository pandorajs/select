/*! select-1.1.0 2014-10-27 09:39:05 */
define("pandora/select/1.1.0/select-debug.handlebars",["gallery/handlebars/1.3.0/handlebars-debug"],function(a,b,c){var d=a("gallery/handlebars/1.3.0/handlebars-debug");c.exports=d.template(function(a,b,c,d,e){function f(){return"has-items"}function g(){return"is-label"}function h(a,b){var d,e="";return e+="\n      ",d=c["if"].call(a,a&&a.multiple,{hash:{},inverse:B.program(10,l,b),fn:B.program(6,i,b),data:b}),(d||0===d)&&(e+=d),e+="\n    "}function i(a,b){var d,e="";return e+="\n        ",d=c.each.call(a,a&&a.select,{hash:{},inverse:B.noop,fn:B.program(7,j,b),data:b}),(d||0===d)&&(e+=d),e+="\n      "}function j(a,b){var d,e="";return e+="\n          ",d=c["if"].call(a,a&&a.selected,{hash:{},inverse:B.noop,fn:B.program(8,k,b),data:b}),(d||0===d)&&(e+=d),e+="\n        "}function k(a,b){var d,e,f="";return f+='\n            <div class="item" data-value="',(e=c.value)?d=e.call(a,{hash:{},data:b}):(e=a&&a.value,d=typeof e===z?e.call(a,{hash:{},data:b}):e),f+=A(d)+'">',(e=c.text)?d=e.call(a,{hash:{},data:b}):(e=a&&a.text,d=typeof e===z?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="</div>\n          "}function l(a,b){var d,e="";return e+="\n        ",d=c.each.call(a,a&&a.select,{hash:{},inverse:B.noop,fn:B.programWithDepth(11,m,b,a),data:b}),(d||0===d)&&(e+=d),e+="\n      "}function m(a,b,d){var e,f="";return f+="\n          ",e=c["if"].call(a,a&&a.selected,{hash:{},inverse:B.noop,fn:B.programWithDepth(12,n,b,d),data:b}),(e||0===e)&&(f+=e),f+="\n        "}function n(a,b,d){var e,f,g="";return g+='\n            <span class="single-text" data-role="single-text">',(f=c.text)?e=f.call(a,{hash:{},data:b}):(f=a&&a.text,e=typeof f===z?f.call(a,{hash:{},data:b}):f),(e||0===e)&&(g+=e),g+="</span>",e=c["if"].call(a,d&&d.search,{hash:{},inverse:B.noop,fn:B.program(13,o,b),data:b}),(e||0===e)&&(g+=e),g+="\n          "}function o(){return'<input type="text" data-role="placeholder" class="placeholder" autocomplete="off"/>'}function p(a,b){var d,e="";return e+="\n      ",d=c["if"].call(a,a&&a.search,{hash:{},inverse:B.program(18,r,b),fn:B.program(16,q,b),data:b}),(d||0===d)&&(e+=d),e+="\n    "}function q(a,b){var d,e,f="";return f+='\n        <span class="single-text" data-role="single-text">',(e=c.label)?d=e.call(a,{hash:{},data:b}):(e=a&&a.label,d=typeof e===z?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+='</span><input type="text" data-role="placeholder" class="placeholder" autocomplete="off"/>\n      '}function r(a,b){var d,e,f="";return f+="\n        ",(e=c.label)?d=e.call(a,{hash:{},data:b}):(e=a&&a.label,d=typeof e===z?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="\n      "}function s(a,b){var e,f="";return f+="\n      ",e=B.invokePartial(d.multiItem,"multiItem",a,c,d,b),(e||0===e)&&(f+=e),f+="\n    "}function t(a,b){var d,e="";return e+="\n      ",d=c.each.call(a,a&&a.select,{hash:{},inverse:B.noop,fn:B.program(23,u,b),data:b}),(d||0===d)&&(e+=d),e+="\n    "}function u(a,b){var e,f="";return f+="\n        ",e=B.invokePartial(d.singleItem,"singleItem",a,c,d,b),(e||0===e)&&(f+=e),f+="\n      "}this.compilerInfo=[4,">= 1.0.0"],c=c||{};for(var v in a.helpers)c[v]=c[v]||a.helpers[v];d=d||a.partials,e=e||{};var w,x,y="",z="function",A=this.escapeExpression,B=this;return y+='<div class="input ',w=c["if"].call(b,b&&b.hasSelected,{hash:{},inverse:B.program(3,g,e),fn:B.program(1,f,e),data:e}),(w||0===w)&&(y+=w),y+='" data-role="select">\n  <div class="selected-panel" data-role="selected" style="min-width:',(x=c.minWidth)?w=x.call(b,{hash:{},data:e}):(x=b&&b.minWidth,w=typeof x===z?x.call(b,{hash:{},data:e}):x),y+=A(w)+";max-width:",(x=c.maxWidth)?w=x.call(b,{hash:{},data:e}):(x=b&&b.maxWidth,w=typeof x===z?x.call(b,{hash:{},data:e}):x),y+=A(w)+";width:",(x=c.width)?w=x.call(b,{hash:{},data:e}):(x=b&&b.width,w=typeof x===z?x.call(b,{hash:{},data:e}):x),y+=A(w)+'">\n    ',w=c["if"].call(b,b&&b.hasSelected,{hash:{},inverse:B.program(15,p,e),fn:B.program(5,h,e),data:e}),(w||0===w)&&(y+=w),y+='\n  </div>\n</div>\n<div class="dropdown" data-role="dropdown" style="display:none">\n  <div class="dropdown-content">\n    ',w=c["if"].call(b,b&&b.multiple,{hash:{},inverse:B.program(22,t,e),fn:B.program(20,s,e),data:e}),(w||0===w)&&(y+=w),y+="\n  </div>\n</div>\n"})});