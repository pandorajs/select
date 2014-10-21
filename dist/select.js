/*! select-1.1.0 2014-10-21 09:43:23 */
define("pandora/select/1.1.0/select",["$","./sifter","./select-items.handlebars","pandora/widget/1.0.0/widget","pandora/base/1.0.0/base","pandora/class/1.0.0/class","pandora/events/1.0.0/events","./select.handlebars","./select-single-item.handlebars","./select-multi-item.handlebars"],function(a,b,c){"use strict";function d(a,b,c){var d,e,f,g,h=[],i=a.options,j=i.length,k=!1;for(d=0;j>d;d++)f=i[d],k||(g=null!==b?b===f.value:f.defaultSelected&&f.selected),e={text:f.text,value:f.value,selected:!k&&g,disabled:f.disabled},h.push(e),g&&(k=!0);return k||c||!h.length||(h[0].selected=!0),h}function e(a,b,c){var d,e,f=!1;for(d=0,e=a.length;e>d;d++)null!==b&&(a[d].selected=b===a[d].value),a[d].selected&&(f=!0);return f||c||!a.length||(a[0].selected=!0),a}function f(a){var b,c,d,e,f=0;for(b=0,c=a.length;c>b;b++)e=a[b].text,d=e.replace(/[^\x00-\xff]/g,"xx").length,d>f&&(f=d);return d}function g(a,b){var c,d,e,f,g,i,j,k=0;for(c=0,d=b.length;d>c;c++)f=b[c].text,e=f.replace(/[^\x00-\xff]/g,"xx").length,e>k&&(k=e,g=f);return i=h("<div/>").css({position:"absolute",left:-9999,top:-9999,width:"auto",whiteSpace:"nowrap"}).html(g.replace(/ /g,"&nbsp;")).insertAfter(a),j=i.width(),i.remove(),j}var h=a("$"),i=a("./sifter"),j=a("./select-items.handlebars"),k=a("pandora/widget/1.0.0/widget"),l={BACKSPACE:8,ENTER:13,UP:38,DOWN:40},m="selected",n=k.extend({defaults:{classPrefix:"ue-select",multiple:!1,delimiter:",",placeholder:"请选择",search:!1,hasOptionAll:!1,defaultText:"全部",sifterOptions:{fields:["text"],emptyTemplate:"无匹配项",limit:1e3},css:{position:"relative"},model:[],selectedIndex:0,template:a("./select.handlebars"),templateOptions:{partials:{singleItem:a("./select-single-item.handlebars"),multiItem:a("./select-multi-item.handlebars")}},insert:function(){this.element.insertAfter(this.option("field")).show()},delegates:{click:function(a){a.stopPropagation()},"click [data-role=select]":function(){this.showSelect?this.hideDropdown():(this.showDropdown(),this.role("placeholder").focus())},"keyup [data-role=placeholder]":"onKey","click [data-role=item]":function(a){"LABEL"===a.currentTarget.tagName?(a.stopPropagation(),this.check(h(a.currentTarget),"INPUT"===a.target.tagName)):this.select(h(a.currentTarget))},"mouseenter [data-role=item]":function(a){h(a.currentTarget).addClass("active")},"mouseleave [data-role=item]":function(a){h(a.currentTarget).removeClass("active")}}},search:function(){if(this.disableKey)return!1;var a=this,b=a.sifter.search(h.trim(a.searchInput.val()),a.option("sifterOptions")),c=b.items,d=[];c.sort(function(a,b){var c=a.id,d=b.id;return d>c?-1:c>d?1:0}),h.each(c,function(c,e){var f=a.sifter.items[e.id],g=new RegExp(b.query,"ig");f.item=f.text.replace(g,function(a){return'<span class="highlight">'+a+"</span>"}),d.push(f)}),a.renderDropdown(d)},keyBack:function(){this.disableKey=!1,this.search(),""===this.searchInput.val()&&this.showPlaceholder()},showPlaceholder:function(){var a=this,b=parseInt(a.data("minWidth"),10)-2;a.maxLength||(a.maxLength=f(a.data("select"))),a.role("single-text").hide(),a.activeInput=!0,a.clearValue(),a.searchInput.css("width",b).attr("maxlength",a.maxLength).attr("placeholder",a.option("placeholder"))},keyEnter:function(){this.role("item").each(function(){return h(this).hasClass(m)?(h(this).trigger("click"),!1):void 0})},keyUp:function(){var a,b=this.role("item");b.each(function(b){return h(this).hasClass(m)&&b>0?(a=b-1,h(this).removeClass(m),!1):void 0}),b.eq(a).addClass(m)},keyDown:function(){var a,b=this.role("item");b.each(function(c){return h(this).hasClass(m)&&c<b.length-1?(a=c+1,h(this).removeClass(m),!1):void 0}),b.eq(a).addClass(m)},onKey:function(a){if(this.option("search"))switch(a.keyCode){case l.BACKSPACE:this.keyBack();break;case l.ENTER:this.keyEnter();break;case l.UP:this.keyUp();break;case l.DOWN:this.keyDown();break;default:this.search()}},renderDropdown:function(a){this.$(".dropdown-content").html(j({items:a,emptyTemplate:this.option("sifterOptions/emptyTemplate")}))},setup:function(){var a,b=this,c=b.option("field");if(!c)throw new Error("field is invalid");c=b.field=h(c).hide(),b.tagName=c[0].tagName.toLowerCase(),b.data("hasSelected",!!b.option("value")||!!c.val()),b.data("label",b.option("label")||c.data("label")||b.option("placeholder")||c.attr("placeholder")),b.once("render",function(){b.element.addClass(b.option("classPrefix")+"-"+(b.option("multiple")?"multiple":"single")),b.initDelegates({mousedown:function(a){b.is(a.target)||b.$(a.target).length||b.hideDropdown()}},b.document)}),a=b.option("load"),a?a.call(b,function(a){b.option("model",a),b.initAttrs(),b.setDataSelect()}):(b.initAttrs(),b.setDataSelect())},setValue:function(a){this.role("item").filter('[data-value="'+a+'"]').trigger("click")},setPlaceholder:function(){if(!this.activeInput){var a;a=this.showSelect?{width:"4px",opacity:1,position:"relative",left:0}:{width:"4px",opacity:0,position:"absolute",left:"-10000px"},this.searchInput.css(a)}},initAttrs:function(){var a,b,c=this,f=c.field,g=c.tagName,i=c.option("model"),j=c.option("multiple"),k=c.option("value")||f.attr("value")||f.val();if("select"===g)i&&i.length?c.data("select",e(i,k,j)):(c.data("select",d(f[0],k,j)),c.option("model",d(f[0],k,j)));else{if(!i||!i.length)throw new Error("option model invalid");c.option("hasOptionAll")&&i.unshift({value:"",text:c.option("defaultText")}),c.data("select",e(i,k,j)),a=c.option("name"),a&&(b=h('[name="'+a+'"]',c.viewport),0===b.length&&(b=h('<input type="hidden" name="'+a+'" />',c.viewport).css({position:"absolute",zIndex:-1}).insertAfter(f)),c.field=b)}},setDataSelect:function(){var a=this,b=a.option("model");a.data({select:b,search:a.option("search"),multiple:a.option("multiple")}),a.option("search")&&(a.sifter=new i(b)),a.render()},render:function(){this.initValue(),n.superclass.render.apply(this),this.setWidth(),this.option("search")&&(this.searchInput=this.role("placeholder"),null===this.value&&this.showPlaceholder(),this.setPlaceholder(),this.bindKeyEvents())},bindKeyEvents:function(){var a=this;a.searchInput.off("keydown").on("keydown",function(){return null!==a.value?(a.disableKey=!0,!1):void 0})},initValue:function(){var a,b,c,d=this,e=d.data("select"),f=[],g=!1;for(a=0,b=e.length;b>a;a++)e[a].selected&&(d.text=e[a].text,f.push(e[a].value),g=!0);c=f.join(d.option("delimiter")),d.data("hasSelected",g),"undefined"==typeof d.value&&(d.value=d.field.val()),d.field.val(c),d.value!==c&&(d.value=c,d.field.change(),d.fire("change"))},clearValue:function(){var a,b,c=this,d=c.data("select");for(a=0,b=d.length;b>a;a++)d[a].selected=!1;c.data("hasSelected",!1),c.value=null,c.searchInput.val("")},setWidth:function(){var a=this,b=a.option("minWidth"),c=a.option("maxWidth");b||(b=(a.option("multiple")?20:6)+g(a.role("selected"),a.data("select"))),c?b>=c?(a.role("selected").css("width",c),a.data("width",c+"px")):(a.role("selected").css("min-width",b).css("max-width",c),a.data("minWidth",b+"px"),a.data("maxWidth",c+"px")):(a.role("selected").css("min-width",b),a.data("minWidth",b+"px"))},showDropdown:function(){var a=this,b=a.role("select");b.addClass("focus input-active dropdown-active"),a.option("multiple")||(a.role("selected").addClass("is-label"),a.role("single-text").text(a.text||void 0)),a.role("dropdown").css({width:b.outerWidth(),left:0,top:b.outerHeight(),visibility:"visible"}).show(),a.showSelect=!0,a.option("search")&&(a.setPlaceholder(),null===a.value&&a.renderDropdown(a.data("select")))},hideDropdown:function(){var a=this;a.role("dropdown").is(":hidden")||(a.role("select").removeClass("focus input-active dropdown-active"),a.option("multiple")||(a.role("selected").removeClass("is-label"),a.role("single-text").text(a.text||void 0),a.activeInput?a.role("select").addClass("input-active"):a.role("single-text").show()),a.role("dropdown").hide(),a.showSelect=!1,a.option("search")&&(a.setPlaceholder(),null===a.value&&a.showPlaceholder()))},select:function(a){var b,c,d=this,e=d.data("select"),f=+a.data("index");if(e[f].selected)return void d.hideDropdown();if(!e[f].disabled){for(d.text=e[f].text,b=0,c=e.length;c>b;b++)e[b].selected=b===f;d.activeInput=!1,d.showSelect=!1,d.render()}},check:function(a,b){var c,d=this,e=d.data("select"),f=+a.data("index");e[f].disabled||(c=a.find("input").is(":checked"),e[f].selected=b?c:!c,d.render(),d.showDropdown())}});c.exports=n}),define("pandora/select/1.1.0/sifter",[],function(a,b,c){!function(a,d){"function"==typeof define&&define.amd?define(d):"object"==typeof b?c.exports=d():a.Sifter=d()}(this,function(){var a=function(a,b){this.items=a,this.settings=b||{diacritics:!0}};a.prototype.tokenize=function(a){if(a=d(String(a||"").toLowerCase()),!a||!a.length)return[];var b,c,f,h,i=[],j=a.split(/ +/);for(b=0,c=j.length;c>b;b++){if(f=e(j[b]),this.settings.diacritics)for(h in g)g.hasOwnProperty(h)&&(f=f.replace(new RegExp(h,"g"),g[h]));i.push({string:j[b],regex:new RegExp(f,"i")})}return i},a.prototype.iterator=function(a,b){var c;c=f(a)?Array.prototype.forEach||function(a){for(var b=0,c=this.length;c>b;b++)a(this[b],b,this)}:function(a){for(var b in this)this.hasOwnProperty(b)&&a(this[b],b,this)},c.apply(a,[b])},a.prototype.getScoreFunction=function(a,b){var c,d,e,f;c=this,a=c.prepareSearch(a,b),e=a.tokens,d=a.options.fields,f=e.length;var g=function(a,b){var c,d;return a?(a=String(a||""),d=a.search(b.regex),-1===d?0:(c=b.string.length/a.length,0===d&&(c+=.5),c)):0},h=function(){var a=d.length;return a?1===a?function(a,b){return g(b[d[0]],a)}:function(b,c){for(var e=0,f=0;a>e;e++)f+=g(c[d[e]],b);return f/a}:function(){return 0}}();return f?1===f?function(a){return h(e[0],a)}:"and"===a.options.conjunction?function(a){for(var b,c=0,d=0;f>c;c++){if(b=h(e[c],a),0>=b)return 0;d+=b}return d/f}:function(a){for(var b=0,c=0;f>b;b++)c+=h(e[b],a);return c/f}:function(){return 0}},a.prototype.getSortFunction=function(a,c){var d,e,f,g,h,i,j,k,l,m,n;if(f=this,a=f.prepareSearch(a,c),n=!a.query&&c.sort_empty||c.sort,l=function(a,b){return"$score"===a?b.score:f.items[b.id][a]},h=[],n)for(d=0,e=n.length;e>d;d++)(a.query||"$score"!==n[d].field)&&h.push(n[d]);if(a.query){for(m=!0,d=0,e=h.length;e>d;d++)if("$score"===h[d].field){m=!1;break}m&&h.unshift({field:"$score",direction:"desc"})}else for(d=0,e=h.length;e>d;d++)if("$score"===h[d].field){h.splice(d,1);break}for(k=[],d=0,e=h.length;e>d;d++)k.push("desc"===h[d].direction?-1:1);return i=h.length,i?1===i?(g=h[0].field,j=k[0],function(a,c){return j*b(l(g,a),l(g,c))}):function(a,c){var d,e,f;for(d=0;i>d;d++)if(f=h[d].field,e=k[d]*b(l(f,a),l(f,c)))return e;return 0}:null},a.prototype.prepareSearch=function(a,b){if("object"==typeof a)return a;b=c({},b);var d=b.fields,e=b.sort,g=b.sort_empty;return d&&!f(d)&&(b.fields=[d]),e&&!f(e)&&(b.sort=[e]),g&&!f(g)&&(b.sort_empty=[g]),{options:b,query:String(a||"").toLowerCase(),tokens:this.tokenize(a),total:0,items:[]}},a.prototype.search=function(a,b){var c,d,e,f,g=this;return d=this.prepareSearch(a,b),b=d.options,a=d.query,f=b.score||g.getScoreFunction(d),a.length?g.iterator(g.items,function(a,e){c=f(a),(b.filter===!1||c>0)&&d.items.push({score:c,id:e})}):g.iterator(g.items,function(a,b){d.items.push({score:1,id:b})}),e=g.getSortFunction(d,b),e&&d.items.sort(e),d.total=d.items.length,"number"==typeof b.limit&&(d.items=d.items.slice(0,b.limit)),d};var b=function(a,b){return"number"==typeof a&&"number"==typeof b?a>b?1:b>a?-1:0:(a=String(a||"").toLowerCase(),b=String(b||"").toLowerCase(),a>b?1:b>a?-1:0)},c=function(a){var b,c,d,e;for(b=1,c=arguments.length;c>b;b++)if(e=arguments[b])for(d in e)e.hasOwnProperty(d)&&(a[d]=e[d]);return a},d=function(a){return(a+"").replace(/^\s+|\s+$|/g,"")},e=function(a){return(a+"").replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")},f=Array.isArray||$&&$.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},g={a:"[aÀÁÂÃÄÅàáâãäåĀā]",c:"[cÇçćĆčČ]",d:"[dđĐďĎ]",e:"[eÈÉÊËèéêëěĚĒē]",i:"[iÌÍÎÏìíîïĪī]",n:"[nÑñňŇ]",o:"[oÒÓÔÕÕÖØòóôõöøŌō]",r:"[rřŘ]",s:"[sŠš]",t:"[tťŤ]",u:"[uÙÚÛÜùúûüůŮŪū]",y:"[yŸÿýÝ]",z:"[zŽž]"};return a})}),define("pandora/select/1.1.0/select-items.handlebars",["gallery/handlebars/1.3.0/handlebars"],function(a,b,c){var d=a("gallery/handlebars/1.3.0/handlebars");c.exports=d.template(function(a,b,c,d,e){function f(a,b){var d,e="";return e+="\n  ",d=c.each.call(a,a&&a.items,{hash:{},inverse:o.noop,fn:o.program(2,g,b),data:b}),(d||0===d)&&(e+=d),e+="\n"}function g(a,b){var d,e,f="";return f+='\n  <div title="',(e=c.text)?d=e.call(a,{hash:{},data:b}):(e=a&&a.text,d=typeof e===m?e.call(a,{hash:{},data:b}):e),f+=n(d)+'" class="item" data-index="'+n((d=null==b||b===!1?b:b.index,typeof d===m?d.apply(a):d))+'" data-role="item" data-value="',(e=c.value)?d=e.call(a,{hash:{},data:b}):(e=a&&a.value,d=typeof e===m?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+='">\n    ',d=c["if"].call(a,a&&a.item,{hash:{},inverse:o.program(5,i,b),fn:o.program(3,h,b),data:b}),(d||0===d)&&(f+=d),f+="\n  </div>\n  "}function h(a,b){var d,e,f="";return f+="\n      ",(e=c.item)?d=e.call(a,{hash:{},data:b}):(e=a&&a.item,d=typeof e===m?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="\n    "}function i(a,b){var d,e,f="";return f+="\n      ",(e=c.text)?d=e.call(a,{hash:{},data:b}):(e=a&&a.text,d=typeof e===m?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="\n    "}function j(a,b){var d,e,f="";return f+='\n  <div class="item" data-role="empty">',(e=c.emptyTemplate)?d=e.call(a,{hash:{},data:b}):(e=a&&a.emptyTemplate,d=typeof e===m?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="</div>\n"}this.compilerInfo=[4,">= 1.0.0"],c=c||{};for(var k in a.helpers)c[k]=c[k]||a.helpers[k];e=e||{};var l,m="function",n=this.escapeExpression,o=this;return l=c["if"].call(b,b&&b.items,{hash:{},inverse:o.program(7,j,e),fn:o.program(1,f,e),data:e}),l||0===l?l:""})}),define("pandora/select/1.1.0/select.handlebars",["gallery/handlebars/1.3.0/handlebars"],function(a,b,c){var d=a("gallery/handlebars/1.3.0/handlebars");c.exports=d.template(function(a,b,c,d,e){function f(){return"has-items"}function g(){return"is-label"}function h(a,b){var d,e="";return e+="\n      ",d=c["if"].call(a,a&&a.multiple,{hash:{},inverse:C.program(10,l,b),fn:C.program(6,i,b),data:b}),(d||0===d)&&(e+=d),e+="\n    "}function i(a,b){var d,e="";return e+="\n        ",d=c.each.call(a,a&&a.select,{hash:{},inverse:C.noop,fn:C.program(7,j,b),data:b}),(d||0===d)&&(e+=d),e+="\n      "}function j(a,b){var d,e="";return e+="\n          ",d=c["if"].call(a,a&&a.selected,{hash:{},inverse:C.noop,fn:C.program(8,k,b),data:b}),(d||0===d)&&(e+=d),e+="\n        "}function k(a,b){var d,e,f="";return f+='\n            <div class="item" data-value="',(e=c.value)?d=e.call(a,{hash:{},data:b}):(e=a&&a.value,d=typeof e===A?e.call(a,{hash:{},data:b}):e),f+=B(d)+'">',(e=c.text)?d=e.call(a,{hash:{},data:b}):(e=a&&a.text,d=typeof e===A?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="</div>\n          "}function l(a,b){var d,e="";return e+="\n        ",d=c.each.call(a,a&&a.select,{hash:{},inverse:C.noop,fn:C.programWithDepth(11,m,b,a),data:b}),(d||0===d)&&(e+=d),e+="\n      "}function m(a,b,d){var e,f="";return f+="\n          ",e=c["if"].call(a,a&&a.selected,{hash:{},inverse:C.noop,fn:C.programWithDepth(12,n,b,d),data:b}),(e||0===e)&&(f+=e),f+="\n        "}function n(a,b,d){var e,f,g="";return g+='\n            <span class="single-text" data-role="single-text">',(f=c.text)?e=f.call(a,{hash:{},data:b}):(f=a&&a.text,e=typeof f===A?f.call(a,{hash:{},data:b}):f),(e||0===e)&&(g+=e),g+="</span>",e=c["if"].call(a,d&&d.search,{hash:{},inverse:C.noop,fn:C.program(13,o,b),data:b}),(e||0===e)&&(g+=e),g+="\n          "}function o(){return'<input type="text" data-role="placeholder" class="placeholder" autocomplete="off"/>'}function p(a,b){var d,e="";return e+="\n      ",d=c["if"].call(a,a&&a.search,{hash:{},inverse:C.program(18,r,b),fn:C.program(16,q,b),data:b}),(d||0===d)&&(e+=d),e+="\n    "}function q(a,b){var d,e,f="";return f+='\n        <span class="single-text" data-role="single-text"></span><input type="text" placeholder="',(e=c.label)?d=e.call(a,{hash:{},data:b}):(e=a&&a.label,d=typeof e===A?e.call(a,{hash:{},data:b}):e),f+=B(d)+'" data-role="placeholder" class="placeholder" autocomplete="off"/>\n      '}function r(a,b){var d,e,f="";return f+="\n        ",(e=c.label)?d=e.call(a,{hash:{},data:b}):(e=a&&a.label,d=typeof e===A?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="\n      "}function s(a,b){var d,e="";return e+="\n      ",d=c.each.call(a,a&&a.select,{hash:{},inverse:C.noop,fn:C.program(21,t,b),data:b}),(d||0===d)&&(e+=d),e+="\n    "}function t(a,b){var e,f="";return f+="\n        ",e=C.invokePartial(d.multiItem,"multiItem",a,c,d,b),(e||0===e)&&(f+=e),f+="\n      "}function u(a,b){var d,e="";return e+="\n      ",d=c.each.call(a,a&&a.select,{hash:{},inverse:C.noop,fn:C.program(24,v,b),data:b}),(d||0===d)&&(e+=d),e+="\n    "}function v(a,b){var e,f="";return f+="\n        ",e=C.invokePartial(d.singleItem,"singleItem",a,c,d,b),(e||0===e)&&(f+=e),f+="\n      "}this.compilerInfo=[4,">= 1.0.0"],c=c||{};for(var w in a.helpers)c[w]=c[w]||a.helpers[w];d=d||a.partials,e=e||{};var x,y,z="",A="function",B=this.escapeExpression,C=this;return z+='<div class="input ',x=c["if"].call(b,b&&b.hasSelected,{hash:{},inverse:C.program(3,g,e),fn:C.program(1,f,e),data:e}),(x||0===x)&&(z+=x),z+='" data-role="select">\n  <div class="selected-panel" data-role="selected" style="min-width:',(y=c.minWidth)?x=y.call(b,{hash:{},data:e}):(y=b&&b.minWidth,x=typeof y===A?y.call(b,{hash:{},data:e}):y),z+=B(x)+";max-width:",(y=c.maxWidth)?x=y.call(b,{hash:{},data:e}):(y=b&&b.maxWidth,x=typeof y===A?y.call(b,{hash:{},data:e}):y),z+=B(x)+";width:",(y=c.width)?x=y.call(b,{hash:{},data:e}):(y=b&&b.width,x=typeof y===A?y.call(b,{hash:{},data:e}):y),z+=B(x)+'">\n    ',x=c["if"].call(b,b&&b.hasSelected,{hash:{},inverse:C.program(15,p,e),fn:C.program(5,h,e),data:e}),(x||0===x)&&(z+=x),z+='\n  </div>\n</div>\n<div class="dropdown" data-role="dropdown" style="display:none">\n  <div class="dropdown-content">\n    ',x=c["if"].call(b,b&&b.multiple,{hash:{},inverse:C.program(23,u,e),fn:C.program(20,s,e),data:e}),(x||0===x)&&(z+=x),z+="\n  </div>\n</div>\n"})}),define("pandora/select/1.1.0/select-single-item.handlebars",["gallery/handlebars/1.3.0/handlebars"],function(a,b,c){var d=a("gallery/handlebars/1.3.0/handlebars");c.exports=d.template(function(a,b,c,d,e){function f(){return" selected"}function g(){return" disabled"}this.compilerInfo=[4,">= 1.0.0"],c=c||{};for(var h in a.helpers)c[h]=c[h]||a.helpers[h];e=e||{};var i,j,k="",l="function",m=this.escapeExpression,n=this;return k+='<div title="',(j=c.text)?i=j.call(b,{hash:{},data:e}):(j=b&&b.text,i=typeof j===l?j.call(b,{hash:{},data:e}):j),k+=m(i)+'" class="item',i=c["if"].call(b,b&&b.selected,{hash:{},inverse:n.noop,fn:n.program(1,f,e),data:e}),(i||0===i)&&(k+=i),i=c["if"].call(b,b&&b.disabled,{hash:{},inverse:n.noop,fn:n.program(3,g,e),data:e}),(i||0===i)&&(k+=i),k+='" data-index="'+m((i=null==e||e===!1?e:e.index,typeof i===l?i.apply(b):i))+'" data-role="item" data-value="',(j=c.value)?i=j.call(b,{hash:{},data:e}):(j=b&&b.value,i=typeof j===l?j.call(b,{hash:{},data:e}):j),(i||0===i)&&(k+=i),k+='">',(j=c.text)?i=j.call(b,{hash:{},data:e}):(j=b&&b.text,i=typeof j===l?j.call(b,{hash:{},data:e}):j),(i||0===i)&&(k+=i),k+="</div>\n"})}),define("pandora/select/1.1.0/select-multi-item.handlebars",["gallery/handlebars/1.3.0/handlebars"],function(a,b,c){var d=a("gallery/handlebars/1.3.0/handlebars");c.exports=d.template(function(a,b,c,d,e){function f(){return" selected"}function g(){return" disabled"}function h(){return" checked"}this.compilerInfo=[4,">= 1.0.0"],c=c||{};for(var i in a.helpers)c[i]=c[i]||a.helpers[i];e=e||{};var j,k,l="",m="function",n=this.escapeExpression,o=this;return l+='<label title="',(k=c.text)?j=k.call(b,{hash:{},data:e}):(k=b&&b.text,j=typeof k===m?k.call(b,{hash:{},data:e}):k),l+=n(j)+'" class="item',j=c["if"].call(b,b&&b.selected,{hash:{},inverse:o.noop,fn:o.program(1,f,e),data:e}),(j||0===j)&&(l+=j),j=c["if"].call(b,b&&b.disabled,{hash:{},inverse:o.noop,fn:o.program(3,g,e),data:e}),(j||0===j)&&(l+=j),l+='" data-index="'+n((j=null==e||e===!1?e:e.index,typeof j===m?j.apply(b):j))+'" data-role="item" data-value="',(k=c.value)?j=k.call(b,{hash:{},data:e}):(k=b&&b.value,j=typeof k===m?k.call(b,{hash:{},data:e}):k),(j||0===j)&&(l+=j),l+='">\n  <input type="checkbox" data-text="',(k=c.text)?j=k.call(b,{hash:{},data:e}):(k=b&&b.text,j=typeof k===m?k.call(b,{hash:{},data:e}):k),(j||0===j)&&(l+=j),l+='" value="',(k=c.value)?j=k.call(b,{hash:{},data:e}):(k=b&&b.value,j=typeof k===m?k.call(b,{hash:{},data:e}):k),(j||0===j)&&(l+=j),l+='"',j=c["if"].call(b,b&&b.selected,{hash:{},inverse:o.noop,fn:o.program(5,h,e),data:e}),(j||0===j)&&(l+=j),j=c["if"].call(b,b&&b.disabled,{hash:{},inverse:o.noop,fn:o.program(3,g,e),data:e}),(j||0===j)&&(l+=j),l+=">\n  <span>",(k=c.text)?j=k.call(b,{hash:{},data:e}):(k=b&&b.text,j=typeof k===m?k.call(b,{hash:{},data:e}):k),(j||0===j)&&(l+=j),l+="</span>\n</label>\n"})});