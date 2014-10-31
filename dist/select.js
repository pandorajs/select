/*! select-1.1.0 2014-10-29 19:22:02 */
define("pandora/select/1.1.0/select",["$","gallery/sifter/0.3.4/sifter","./select-items.handlebars","pandora/widget/1.0.0/widget","pandora/base/1.0.0/base","pandora/class/1.0.0/class","pandora/events/1.0.0/events","./select.handlebars","./select-single-item.handlebars","./select-multi-item.handlebars"],function(a,b,c){"use strict";function d(a,b){var c,d,e,f,g=[],h=a.options,i=h.length,j=!1;for(c=0;i>c;c++)e=h[c],j||(f=null!==b?b===e.value:e.defaultSelected&&e.selected),d={text:e.text,index:c,value:e.value,selected:!j&&f,disabled:e.disabled},g.push(d),f&&(j=!0);return g}function e(a,b,c){var d,e;for(d=0,e=a.length;e>d;d++){var f;f=c?null!==b&&-1!==b.indexOf(a[d].value):null!==b&&b===a[d].value,a[d].index=d,a[d].selected=f}return a}function f(a){var b,c,d,e,f=0;for(b=0,c=a.length;c>b;b++)e=a[b].text,d=e.replace(/[^\x00-\xff]/g,"xx").length,d>f&&(f=d);return d}function g(a,b){var c,d,e,f,g,i,j,k=0;for(c=0,d=b.length;d>c;c++)f=b[c].text,e=f.replace(/[^\x00-\xff]/g,"xx").length,e>k&&(k=e,g=f);return i=h("<div/>").css({position:"absolute",left:-9999,top:-9999,width:"auto",whiteSpace:"nowrap"}).html(g.replace(/ /g,"&nbsp;")).insertAfter(a),j=i.width(),i.remove(),j}var h=a("$"),i=a("gallery/sifter/0.3.4/sifter"),j=a("./select-items.handlebars"),k=a("pandora/widget/1.0.0/widget"),l={BACKSPACE:8,ENTER:13,UP:38,DOWN:40},m="selected",n=k.extend({defaults:{classPrefix:"ue-select",multiple:!1,delimiter:",",placeholder:"请选择",search:!1,hasOptionAll:!1,hasLabel:!1,defaultText:"全部",sifterOptions:{fields:["text"],placeholder:"请输入...",emptyTemplate:"无匹配项",limit:1e3},css:{position:"relative"},model:[],minWidth:null,maxWidth:200,template:a("./select.handlebars"),templateOptions:{partials:{singleItem:a("./select-single-item.handlebars"),multiItem:a("./select-multi-item.handlebars")}},insert:function(){this.element.insertAfter(this.option("field")).show()},delegates:{"click [data-role=select]":function(a){a.stopPropagation(),this.showSelect?this.hideDropdown():(this.showDropdown(),this.role("placeholder").focus())},"keyup [data-role=placeholder]":"onKey","click [data-role=item]":function(a){"LABEL"===a.currentTarget.tagName?(a.stopPropagation(),this.check(h(a.currentTarget),"INPUT"===a.target.tagName)):this.select(h(a.currentTarget))},"mouseenter [data-role=item]":function(a){h(a.currentTarget).addClass("active")},"mouseleave [data-role=item]":function(a){h(a.currentTarget).removeClass("active")}}},search:function(){if(this.disableKey)return!1;var a=this,b=a.searchResult=a.sifter.search(h.trim(a.searchInput.val()),a.option("sifterOptions")),c=b.items,d=[];c.sort(function(a,b){var c=a.id,d=b.id;return d>c?-1:c>d?1:0}),h.each(c,function(c,e){var f=a.sifter.items[e.id],g=new RegExp(b.query,"ig");f.item=f.text.replace(g,function(a){return'<span class="highlight">'+a+"</span>"}),d.push(f)}),a.renderDropdown(d)},keyBack:function(){this.disableKey=!1,this.search(),""===this.searchInput.val()&&this.showPlaceholder()},showPlaceholder:function(){var a=this,b=g(a.role("selected"),a.data("select"));a.maxLength||(a.maxLength=f(a.data("select"))),a.role("single-text").hide(),a.activeInput=!0,a.clearValue(),a.searchInput.css("width",b).attr("maxlength",a.maxLength).attr("placeholder",a.option("sifterOptions/placeholder"))},hidePlaceholder:function(){null===this.value&&null===this.text&&this.role("select").addClass("is-label"),this.searchInput.removeAttr("placeholder")},keyEnter:function(){this.role("item").each(function(){return h(this).hasClass(m)?(h(this).trigger("click"),!1):void 0})},keyUp:function(){var a,b=this.role("item");b.each(function(b){return h(this).hasClass(m)&&b>0?(a=b-1,h(this).removeClass(m),!1):void 0}),b.eq(a).addClass(m)},keyDown:function(){var a,b=this.role("item");b.each(function(c){return h(this).hasClass(m)&&c<b.length-1?(a=c+1,h(this).removeClass(m),!1):void 0}),b.eq(a).addClass(m)},onKey:function(a){if(this.option("search"))switch(a.keyCode){case l.BACKSPACE:this.keyBack();break;case l.ENTER:this.keyEnter();break;case l.UP:this.keyUp();break;case l.DOWN:this.keyDown();break;default:this.search()}},renderDropdown:function(a){this.$(".dropdown-content").html(j({items:a,emptyTemplate:this.option("sifterOptions/emptyTemplate")}))},setup:function(){var a,b=this,c=b.option("field");if(!c)throw new Error("field is invalid");c=b.field=h(c).hide(),b.tagName=c[0].tagName.toLowerCase(),b.data("hasSelected",!!b.option("value")||!!c.val()),b.option("placeholder",c.attr("placeholder")),b.data("label",b.option("label")||c.data("label")||b.option("placeholder")),b.once("render",function(){b.element.addClass(b.option("classPrefix")+"-"+(b.option("multiple")?"multiple":"single")),b.initDelegates({mousedown:function(a){b.is(a.target)||b.$(a.target).length||b.showSelect&&b.hideDropdown()}},b.document)}),a=b.option("load"),a?a.call(b,function(a){b.option("model",a),b.initAttrs(),b.setDataSelect()}):(b.initAttrs(),b.setDataSelect())},setValue:function(a){this.role("item").filter('[data-value="'+a+'"]').trigger("click")},setPlaceholder:function(){if(!this.activeInput){var a;a=this.showSelect?{width:"4px",opacity:1,position:"relative",left:0}:{width:"4px",opacity:0,position:"absolute",left:"-10000px"},this.searchInput.css(a)}},initAttrs:function(){var a,b,c=this,f=c.field,g=c.tagName,i=c.option("model"),j=c.option("multiple"),k=c.option("value")||f.val()||null;if("select"===g){var l=f.attr("value");l?k=l:c.option("hasLabel")&&(k=null),i&&i.length?c.data("select",e(i,k)):(i=d(f[0],k),c.data("select",i))}else{if(!i||!i.length)throw new Error("option model invalid");c.option("hasOptionAll")&&i.unshift({value:"",text:c.option("defaultText")}),c.data("select",e(i,k,j)),a=c.option("name"),a&&(b=h('[name="'+a+'"]',c.viewport),0===b.length&&(b=h('<input type="hidden" name="'+a+'" />',c.viewport).css({position:"absolute",zIndex:-1}).insertAfter(f)),c.field=b)}},setDataSelect:function(){var a=this,b=a.option("model");a.data({select:b,maxWidth:a.option("maxWidth")+"px",search:a.option("search"),multiple:a.option("multiple")}),a.option("search")&&(a.sifter=new i(b)),a.render()},render:function(){this.initValue(),n.superclass.render.apply(this),this.setWidth(),this.option("search")&&(this.searchInput=this.role("placeholder"),this.setPlaceholder(),this.bindKeyEvents())},bindKeyEvents:function(){var a=this;a.searchInput.off("keydown").on("keydown",function(){return null!==a.value||null!==a.text?(a.disableKey=!0,!1):void 0})},initValue:function(){var a,b,c,d=this,e=d.data("select"),f=[],g=!1;for(a=0,b=e.length;b>a;a++)e[a].selected&&(d.text=e[a].text,f.push(e[a].value),g=!0);c=f.join(d.option("delimiter"))||null,d.data("hasSelected",g),"undefined"==typeof d.value&&(d.value=d.field.val()||null),d.field.val(c||""),d.value!==c&&(d.value=c,d.field.change(),d.fire("change"))},clearValue:function(){var a,b,c=this,d=c.data("select");for(a=0,b=d.length;b>a;a++)d[a].selected=!1;c.data("hasSelected",!1),c.value=null,c.text=null,c.field.val(""),c.searchInput.val("")},setWidth:function(){var a=this,b=a.option("search")?6:0,c=a.option("minWidth"),d=a.option("maxWidth");c||(c=(a.option("multiple")?20:b)+g(a.role("selected"),a.data("select"))),d?c>=d?(a.role("selected").css("width",d),a.data("width",d+"px"),a.role("single-text").css("max-width",d-b)):(a.role("selected").css("min-width",c).css("max-width",d),a.role("single-text").css("max-width",d-b),a.data("minWidth",c+"px"),a.data("maxWidth",d+"px")):(a.role("selected").css("min-width",c),a.role("single-text").css("max-width",c-b),a.data("minWidth",c+"px"))},showDropdown:function(){var a=this,b=a.role("select");b.addClass("focus input-active dropdown-active"),a.option("multiple")||(a.role("selected").addClass("is-label"),a.role("single-text").text(a.text||void 0)),a.role("dropdown").css({width:b.outerWidth(),left:0,top:b.outerHeight(),visibility:"visible"}).show(),a.showSelect=!0,a.option("search")&&(a.setPlaceholder(),a.value||a.text||(a.showPlaceholder(),a.renderDropdown(a.data("select"))))},hideDropdown:function(){var a=this;a.role("dropdown").is(":hidden")||(a.showSelect=!1,a.role("select").removeClass("focus input-active dropdown-active"),a.option("multiple")||(a.option("search")&&(a.activeInput=!1,a.setPlaceholder(),a.hidePlaceholder()),a.role("selected").removeClass("is-label"),a.role("single-text").show().text(a.text||a.option("placeholder"))),a.role("dropdown").hide())},select:function(a){var b,c,d=this,e=d.data("select"),f=+a.data("index");if(e[f].selected)return void d.hideDropdown();if(!e[f].disabled){for(d.text=e[f].text,b=0,c=e.length;c>b;b++)e[b].selected=b===f;d.activeInput=!1,d.showSelect=!1,d.render()}},check:function(a,b){var c,d=this,e=d.data("select"),f=+a.data("index");e[f].disabled||(c=a.find("input").is(":checked"),e[f].selected=b?c:!c,d.render(),d.showDropdown())}});c.exports=n}),define("pandora/select/1.1.0/select-items.handlebars",["gallery/handlebars/1.3.0/handlebars"],function(a,b,c){var d=a("gallery/handlebars/1.3.0/handlebars");c.exports=d.template(function(a,b,c,d,e){function f(a,b){var d,e="";return e+="\n  ",d=c.each.call(a,a&&a.items,{hash:{},inverse:o.noop,fn:o.program(2,g,b),data:b}),(d||0===d)&&(e+=d),e+="\n"}function g(a,b){var d,e,f="";return f+='\n  <div title="',(e=c.text)?d=e.call(a,{hash:{},data:b}):(e=a&&a.text,d=typeof e===m?e.call(a,{hash:{},data:b}):e),f+=n(d)+'" class="item" data-index="',(e=c.index)?d=e.call(a,{hash:{},data:b}):(e=a&&a.index,d=typeof e===m?e.call(a,{hash:{},data:b}):e),f+=n(d)+'" data-role="item" data-value="',(e=c.value)?d=e.call(a,{hash:{},data:b}):(e=a&&a.value,d=typeof e===m?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+='">\n    ',d=c["if"].call(a,a&&a.item,{hash:{},inverse:o.program(5,i,b),fn:o.program(3,h,b),data:b}),(d||0===d)&&(f+=d),f+="\n  </div>\n  "}function h(a,b){var d,e,f="";return f+="\n      ",(e=c.item)?d=e.call(a,{hash:{},data:b}):(e=a&&a.item,d=typeof e===m?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="\n    "}function i(a,b){var d,e,f="";return f+="\n      ",(e=c.text)?d=e.call(a,{hash:{},data:b}):(e=a&&a.text,d=typeof e===m?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="\n    "}function j(a,b){var d,e,f="";return f+='\n  <div class="item" data-role="empty">',(e=c.emptyTemplate)?d=e.call(a,{hash:{},data:b}):(e=a&&a.emptyTemplate,d=typeof e===m?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="</div>\n"}this.compilerInfo=[4,">= 1.0.0"],c=c||{};for(var k in a.helpers)c[k]=c[k]||a.helpers[k];e=e||{};var l,m="function",n=this.escapeExpression,o=this;return l=c["if"].call(b,b&&b.items,{hash:{},inverse:o.program(7,j,e),fn:o.program(1,f,e),data:e}),l||0===l?l:""})}),define("pandora/select/1.1.0/select.handlebars",["gallery/handlebars/1.3.0/handlebars"],function(a,b,c){var d=a("gallery/handlebars/1.3.0/handlebars");c.exports=d.template(function(a,b,c,d,e){function f(){return"has-items"}function g(){return"is-label"}function h(a,b){var d,e="";return e+="\n      ",d=c["if"].call(a,a&&a.multiple,{hash:{},inverse:z.program(10,l,b),fn:z.program(6,i,b),data:b}),(d||0===d)&&(e+=d),e+="\n    "}function i(a,b){var d,e="";return e+="\n        ",d=c.each.call(a,a&&a.select,{hash:{},inverse:z.noop,fn:z.program(7,j,b),data:b}),(d||0===d)&&(e+=d),e+="\n      "}function j(a,b){var d,e="";return e+="\n          ",d=c["if"].call(a,a&&a.selected,{hash:{},inverse:z.noop,fn:z.program(8,k,b),data:b}),(d||0===d)&&(e+=d),e+="\n        "}function k(a,b){var d,e,f="";return f+='\n            <div class="item" data-value="',(e=c.value)?d=e.call(a,{hash:{},data:b}):(e=a&&a.value,d=typeof e===x?e.call(a,{hash:{},data:b}):e),f+=y(d)+'">',(e=c.text)?d=e.call(a,{hash:{},data:b}):(e=a&&a.text,d=typeof e===x?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="</div>\n          "}function l(a,b){var d,e="";return e+="\n        ",d=c.each.call(a,a&&a.select,{hash:{},inverse:z.noop,fn:z.programWithDepth(11,m,b,a),data:b}),(d||0===d)&&(e+=d),e+="\n      "}function m(a,b,d){var e,f="";return f+="\n          ",e=c["if"].call(a,a&&a.selected,{hash:{},inverse:z.noop,fn:z.programWithDepth(12,n,b,d),data:b}),(e||0===e)&&(f+=e),f+="\n        "}function n(a,b,d){var e,f,g="";return g+='\n            <span class="single-text" data-role="single-text">',(f=c.text)?e=f.call(a,{hash:{},data:b}):(f=a&&a.text,e=typeof f===x?f.call(a,{hash:{},data:b}):f),(e||0===e)&&(g+=e),g+="</span>",e=c["if"].call(a,d&&d.search,{hash:{},inverse:z.noop,fn:z.program(13,o,b),data:b}),(e||0===e)&&(g+=e),g+="\n          "}function o(){return'<input type="text" data-role="placeholder" class="placeholder" autocomplete="off"/>'}function p(a,b){var d,e,f="";return f+='\n      <span class="single-text" data-role="single-text">',(e=c.label)?d=e.call(a,{hash:{},data:b}):(e=a&&a.label,d=typeof e===x?e.call(a,{hash:{},data:b}):e),(d||0===d)&&(f+=d),f+="</span>",d=c["if"].call(a,a&&a.search,{hash:{},inverse:z.noop,fn:z.program(13,o,b),data:b}),(d||0===d)&&(f+=d),f+="\n    "}function q(a,b){var e,f="";return f+="\n      ",e=z.invokePartial(d.multiItem,"multiItem",a,c,d,b),(e||0===e)&&(f+=e),f+="\n    "}function r(a,b){var d,e="";return e+="\n      ",d=c.each.call(a,a&&a.select,{hash:{},inverse:z.noop,fn:z.program(20,s,b),data:b}),(d||0===d)&&(e+=d),e+="\n    "}function s(a,b){var e,f="";return f+="\n        ",e=z.invokePartial(d.singleItem,"singleItem",a,c,d,b),(e||0===e)&&(f+=e),f+="\n      "}this.compilerInfo=[4,">= 1.0.0"],c=c||{};for(var t in a.helpers)c[t]=c[t]||a.helpers[t];d=d||a.partials,e=e||{};var u,v,w="",x="function",y=this.escapeExpression,z=this;return w+='<div class="input ',u=c["if"].call(b,b&&b.hasSelected,{hash:{},inverse:z.program(3,g,e),fn:z.program(1,f,e),data:e}),(u||0===u)&&(w+=u),w+='" data-role="select">\n  <div class="selected-panel" data-role="selected" style="min-width:',(v=c.minWidth)?u=v.call(b,{hash:{},data:e}):(v=b&&b.minWidth,u=typeof v===x?v.call(b,{hash:{},data:e}):v),w+=y(u)+";max-width:",(v=c.maxWidth)?u=v.call(b,{hash:{},data:e}):(v=b&&b.maxWidth,u=typeof v===x?v.call(b,{hash:{},data:e}):v),w+=y(u)+";width:",(v=c.width)?u=v.call(b,{hash:{},data:e}):(v=b&&b.width,u=typeof v===x?v.call(b,{hash:{},data:e}):v),w+=y(u)+'">\n    ',u=c["if"].call(b,b&&b.hasSelected,{hash:{},inverse:z.program(15,p,e),fn:z.program(5,h,e),data:e}),(u||0===u)&&(w+=u),w+='\n  </div>\n</div>\n<div class="dropdown" data-role="dropdown" style="display:none">\n  <div class="dropdown-content">\n    ',u=c["if"].call(b,b&&b.multiple,{hash:{},inverse:z.program(19,r,e),fn:z.program(17,q,e),data:e}),(u||0===u)&&(w+=u),w+="\n  </div>\n</div>\n"})}),define("pandora/select/1.1.0/select-single-item.handlebars",["gallery/handlebars/1.3.0/handlebars"],function(a,b,c){var d=a("gallery/handlebars/1.3.0/handlebars");c.exports=d.template(function(a,b,c,d,e){function f(){return" selected"}function g(){return" disabled"}this.compilerInfo=[4,">= 1.0.0"],c=c||{};for(var h in a.helpers)c[h]=c[h]||a.helpers[h];e=e||{};var i,j,k="",l="function",m=this.escapeExpression,n=this;return k+='<div title="',(j=c.text)?i=j.call(b,{hash:{},data:e}):(j=b&&b.text,i=typeof j===l?j.call(b,{hash:{},data:e}):j),k+=m(i)+'" class="item',i=c["if"].call(b,b&&b.selected,{hash:{},inverse:n.noop,fn:n.program(1,f,e),data:e}),(i||0===i)&&(k+=i),i=c["if"].call(b,b&&b.disabled,{hash:{},inverse:n.noop,fn:n.program(3,g,e),data:e}),(i||0===i)&&(k+=i),k+='" data-index="',(j=c.index)?i=j.call(b,{hash:{},data:e}):(j=b&&b.index,i=typeof j===l?j.call(b,{hash:{},data:e}):j),k+=m(i)+'" data-role="item" data-value="',(j=c.value)?i=j.call(b,{hash:{},data:e}):(j=b&&b.value,i=typeof j===l?j.call(b,{hash:{},data:e}):j),(i||0===i)&&(k+=i),k+='">',(j=c.text)?i=j.call(b,{hash:{},data:e}):(j=b&&b.text,i=typeof j===l?j.call(b,{hash:{},data:e}):j),(i||0===i)&&(k+=i),k+="</div>\n"})}),define("pandora/select/1.1.0/select-multi-item.handlebars",["gallery/handlebars/1.3.0/handlebars"],function(a,b,c){var d=a("gallery/handlebars/1.3.0/handlebars");c.exports=d.template(function(a,b,c,d,e){function f(a,b,d){var e,f,j="";return j+='\n<label title="',(f=c.text)?e=f.call(a,{hash:{},data:b}):(f=a&&a.text,e=typeof f===o?f.call(a,{hash:{},data:b}):f),j+=p(e)+'" class="item',e=c["if"].call(a,a&&a.selected,{hash:{},inverse:q.noop,fn:q.program(2,g,b),data:b}),(e||0===e)&&(j+=e),e=c["if"].call(a,a&&a.disabled,{hash:{},inverse:q.noop,fn:q.program(4,h,b),data:b}),(e||0===e)&&(j+=e),j+='" data-index="'+p((e=null==b||b===!1?b:b.index,typeof e===o?e.apply(a):e))+'" data-role="item" data-value="',(f=c.value)?e=f.call(a,{hash:{},data:b}):(f=a&&a.value,e=typeof f===o?f.call(a,{hash:{},data:b}):f),(e||0===e)&&(j+=e),j+='">\n  <input type="checkbox" data-text="',(f=c.text)?e=f.call(a,{hash:{},data:b}):(f=a&&a.text,e=typeof f===o?f.call(a,{hash:{},data:b}):f),(e||0===e)&&(j+=e),j+='" value="',(f=c.value)?e=f.call(a,{hash:{},data:b}):(f=a&&a.value,e=typeof f===o?f.call(a,{hash:{},data:b}):f),(e||0===e)&&(j+=e),j+='"',e=c["if"].call(a,a&&a.selected,{hash:{},inverse:q.noop,fn:q.program(6,i,b),data:b}),(e||0===e)&&(j+=e),e=c["if"].call(a,a&&a.disabled,{hash:{},inverse:q.noop,fn:q.program(4,h,b),data:b}),(e||0===e)&&(j+=e),j+='>\n  <span style="max-width: '+p((e=d&&d.maxWidth,typeof e===o?e.apply(a):e))+'">',(f=c.text)?e=f.call(a,{hash:{},data:b}):(f=a&&a.text,e=typeof f===o?f.call(a,{hash:{},data:b}):f),(e||0===e)&&(j+=e),j+="</span>\n</label>\n"}function g(){return" selected"}function h(){return" disabled"}function i(){return" checked"}this.compilerInfo=[4,">= 1.0.0"],c=c||{};for(var j in a.helpers)c[j]=c[j]||a.helpers[j];e=e||{};var k,l,m,n="",o="function",p=this.escapeExpression,q=this,r=c.blockHelperMissing;return m={hash:{},inverse:q.noop,fn:q.programWithDepth(1,f,e,b),data:e},(l=c.select)?k=l.call(b,m):(l=b&&b.select,k=typeof l===o?l.call(b,m):l),c.select||(k=r.call(b,k,{hash:{},inverse:q.noop,fn:q.programWithDepth(1,f,e,b),data:e})),(k||0===k)&&(n+=k),n+="\n"})});