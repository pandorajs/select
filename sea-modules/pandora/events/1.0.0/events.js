/*! events-1.0.0 2014-07-30 10:58:55 */
define("pandora/events/1.0.0/events",["$"],function(a,b,c){"use strict";var d=a("$"),e=/\s+/,f=function(){};f.prototype={on:function(a,b){var c,f=this.__events||(this.__events={}),g={};return d.isPlainObject(a)?g=a:g[a]=b,d.each(g,function(b,d){for(b=b.split(e);a=b.shift();)c=f[a]||(f[a]=[]),c.push(d)}),this},once:function(a,b){var c=function(){this.off(a,c),b.apply(this,arguments)};return this.on(a,c)},off:function(a,b){var c,d,f,g=this.__events;if(!g)return this;if(!a)return this.__events={},this;for(c=a.split(e);a=c.shift();)if(d=g[a])for(b||delete g[a],f=d.length;f>=0;f--)d[f]===b&&d.splice(f,1);return this},fire:function(a){var b,c,d,f,g,h,i,j=this.__events,k=!0;if(!j||!a)return k;for(b=Array.prototype.slice.call(arguments,1),f=a.target||this,c=(a.type||a).split(e);a=c.shift();)for(d=[{type:a,target:f}].concat(b),"all"!==a&&(g=j[a]),g||(g=[]),g=g.concat(j.all||[]),h=0,i=g.length;i>h;h++)g[h].apply(this,d)===!1&&(k=!1);return k}},f.prototype.emit=f.prototype.trigger=f.prototype.fire,c.exports=f});