/*! importstyle-1.0.0 2014-09-01 14:24:08 */
define("pandora/importstyle/1.0.0/importstyle",[],function(a,b,c){"use strict";var d,e=/\W/g,f=document,g=document.head||document.getElementsByTagName("head")[0]||document.documentElement;c.exports=function(a,b){var c;if(!b||(b=b.replace(e,"-"),!f.getElementById(b))){if(!d||b?(c=f.createElement("style"),b&&(c.id=b),g.appendChild(c)):c=d,c.styleSheet){if(f.getElementsByTagName("style").length>31)throw new Error("Exceed the maximal count of style tags in IE");c.styleSheet.cssText+=a}else c.appendChild(f.createTextNode(a));b||(d=c)}}});