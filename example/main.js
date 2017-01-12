'use strict';

var Dialog = require('../src/select');
var $ = require('jquery');

require('../src/select.less');

var input = $('<input id="test" type="text" value="" />').appendTo(document.body);
var nativeSelect = $('<select id="test1"></select>').appendTo(document.body);
nativeSelect.append('<option value="0">text1</option>');
nativeSelect.append('<option value="1">text2</option>');
nativeSelect.append('<option value="2">text3</option>');

var $ = require('jquery');
var Select = require('../src/select');
// var select = new Select({
//     //search: true,
//     minWidth: 50,
//     hasLabel: true,
//     field: '#example1',
//     //value: '1'
// });
//
// $('#btn-off').click(function(){
//     select.disable();
// });
// $('#btn-on').click(function(){
//     select.enable();
// });

input.val('13');
select = new Select({
  field: '#test',
  multiple: true,
  model: [{
    text: 'text1',
    value: '1'
  }, {
    text: 'text1',
    value: '2'
  }, {
    text: 'text1',
    value: '13'
  }]
  // load: function(callback) {
  //   callback([{
  //     text: 'text1',
  //     value: '1'
  //   }, {
  //     text: 'text1',
  //     value: '2'
  //   }, {
  //     text: 'text1',
  //     value: '13'
  //   }]);
  // }

});
