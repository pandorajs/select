/*! select-1.1.0 2014-10-29 19:22:02 */
define("pandora/select/1.1.0/select-single-item.handlebars",["gallery/handlebars/1.3.0/handlebars"],function(a,b,c){var d=a("gallery/handlebars/1.3.0/handlebars");c.exports=d.template(function(a,b,c,d,e){function f(){return" selected"}function g(){return" disabled"}this.compilerInfo=[4,">= 1.0.0"],c=c||{};for(var h in a.helpers)c[h]=c[h]||a.helpers[h];e=e||{};var i,j,k="",l="function",m=this.escapeExpression,n=this;return k+='<div title="',(j=c.text)?i=j.call(b,{hash:{},data:e}):(j=b&&b.text,i=typeof j===l?j.call(b,{hash:{},data:e}):j),k+=m(i)+'" class="item',i=c["if"].call(b,b&&b.selected,{hash:{},inverse:n.noop,fn:n.program(1,f,e),data:e}),(i||0===i)&&(k+=i),i=c["if"].call(b,b&&b.disabled,{hash:{},inverse:n.noop,fn:n.program(3,g,e),data:e}),(i||0===i)&&(k+=i),k+='" data-index="',(j=c.index)?i=j.call(b,{hash:{},data:e}):(j=b&&b.index,i=typeof j===l?j.call(b,{hash:{},data:e}):j),k+=m(i)+'" data-role="item" data-value="',(j=c.value)?i=j.call(b,{hash:{},data:e}):(j=b&&b.value,i=typeof j===l?j.call(b,{hash:{},data:e}):j),(i||0===i)&&(k+=i),k+='">',(j=c.text)?i=j.call(b,{hash:{},data:e}):(j=b&&b.text,i=typeof j===l?j.call(b,{hash:{},data:e}):j),(i||0===i)&&(k+=i),k+="</div>\n"})});