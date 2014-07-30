define(function(require, exports, module) {

'use strict';

/**
 * Select
 *
 * @module Select
 * @class Select
 * @constructor
 * @extends Widget
 * @examples
 * // 将原生 dom 转换为 select
 * var select = new Select({
 *   filed: '#select'
 * });
 *
 * // 通过 model 定义 select 数据
 * var select = new Select({
 *   field: '#select1',
 *   model: [
 *     {text: 'text1', value:'1'},
 *     {text: 'text2}, value: '2'}
 *   ]
 * });
 */
var $ = require('$');
var Widget = require('widget');
/**
 * 模拟 select 组件
 *
 * @class Select
 * @constructor
 * @extends Widget
 * @type {*|Object|Function|void}
 */
var Select = Widget.extend({
  /**
   * Select 默认配置
   *
   * @property {Object} defaults
   * @type {Ojbect}
   */
  defaults: {
    classPrefix: 'ue-select',

    // 可多选，为 checkbox 多选
    multiple: false,

    // 分隔符，多选时才有用
    delimiter: ',',

    placeholder: '',

    // input 或 select 元素，必填
    // field: null,
    // label: null,

    css: {
      // width: '200',
      position: 'relative'
    },

    model: [],

    // name: null,
    // value: null,

    // minWidth: null,
    // maxWidth: null,

    selectedIndex: 0,

    template: require('./select.handlebars'),
    templateOptions: {
      partials: {
        singleItem: require('./select-single-item.handlebars'),
        multiItem: require('./select-multi-item.handlebars')
      }
    },

    insert: function() {
      this.element.insertAfter(this.option('field')).show();
    },

    delegates: {
      'click': function (e) {
        e.stopPropagation();
      },
      'click [data-role=select]': function (e) {
        this.showDropdown();
      },
      'click [data-role=item]': function (e) {
        if (e.currentTarget.tagName === 'LABEL') {
          e.stopPropagation();
          this.check($(e.currentTarget), e.target.tagName === 'INPUT');
        } else {
          this.select($(e.currentTarget));
        }
      },
      'mouseenter [data-role=item]': function(e) {
        $(e.currentTarget).addClass('active');
      },
      'mouseleave [data-role=item]': function(e) {
        $(e.currentTarget).removeClass('active');
      }
    }
  },

  setup: function() {
    var self = this,
        field = self.option('field'),
        optionLoad;

    if (!field) {
      throw new Error('请设置 field');
    }

    field = self.field = $(field).hide();

    // 存储 field 的 tagName
    self.tagName = field[0].tagName.toLowerCase();

    self.data('hasSelected', !!self.option('value') || !!field.val());

    self.data('label',
        self.option('label') ||
        field.data('label') ||
        self.option('placeholder') ||
        field.attr('placeholder'));

    self.once('render', function() {
        self.element.addClass(
          self.option('classPrefix') + '-' + (self.option('multiple') ? 'multiple' : 'single')
        );
        self.initDelegates({
          'mousedown': function (e) {
            if (!(self.is(e.target) ||
                  self.$(e.target).length)) {
              self.hideDropdown();
            }
          }
        }, self.document);
      });

    optionLoad = self.option('load');

    // 异步请求
    if (optionLoad) {
      optionLoad.call(self, function (data) {
        self.setDataSelect(data);
      });
    } else {
      self.initAttrs();
      self.setDataSelect(self.option('model'));
    }
  },

  /**
   * 显示之前初始属性值
   *
   * @method initAttrs
   * @return {[type]} [description]
   */
  initAttrs: function() {
    var self = this,
        selectName,
        selectElem,
        field = self.field,
        tagName = self.tagName,
        model = self.option('model'),
        value = self.option('value') || field.val();

    if (tagName === 'select') {
      // option 设置 model 优先级高
      if (model && model.length) {
        self.data('select', completeModel(model, value));
      } else {
        self.data('select', convertSelect(field[0], value));
      }
    } else {
      if (!model || !model.length) {
        throw new Error('option model invalid');
      }

      // trigger 如果为其他 DOM，则由用户提供 model
      self.data('select', completeModel(model, value));

      // 如果 name 存在则创建隐藏域
      selectName = self.option('name');

      if (selectName) {
        selectElem = $('[name="' + selectName + '"]', self.viewport);
        if (selectElem.length === 0) {
          selectElem = $(
            '<input type="hidden" name="' + selectName + '" />', self.viewport
          ).css({
            position: 'absolute',
            zIndex: -1
          }).insertAfter(field);
        }
        self.field = selectElem;
      }
    }
  },

  setDataSelect: function (data) {
    var self = this;

    self.data({
      select: data,
      multiple: self.option('multiple')
    });

    self.render();
  },

  render: function () {
    this.initValue();
    Select.superclass.render.apply(this);
    this.setWidth();
  },

  /**
   * 回填 value
   *
   * @method initValue
   */
  initValue: function () {
    var self = this,
        datas = self.data('select'),
        i, l, values = [],
        newValue,
        hasSelected = false;

    for (i = 0, l = datas.length; i < l; i++) {
      if (datas[i].selected) {
        self.text = datas[i].text;
        values.push(datas[i].value);
        hasSelected = true;
      }
    }

    newValue = values.join(self.option('delimiter'));

    self.data('hasSelected', hasSelected);

    if (typeof self.value === 'undefined') {
      self.value = self.field.val();
    }

    self.field.val(newValue);

    if (self.value !== newValue) {
      self.value = newValue;
      self.fire('change');
    }
  },

  setWidth: function () {
    var self = this,
        minWidth = self.option('minWidth'),
        maxWidth = self.option('maxWidth'),
        calWidth;

    if (!minWidth) {
      minWidth = (self.option('multiple') ? 20 : 0) +
            getStringWidth(self.role('selected'), self.data('select'));
    }

    // 设置宽度同时保存到data备用

    if (maxWidth) {
      if (minWidth >= maxWidth) {
        self.role('selected')
            .css('width', maxWidth);
        self.data('width', maxWidth + 'px');
      } else {
        self.role('selected')
            .css('min-width', minWidth)
            .css('max-width', maxWidth);
        self.data('minWidth', minWidth + 'px');
        self.data('maxWidth', maxWidth + 'px');
      }
    } else {
      self.role('selected')
          .css('min-width', minWidth);
      self.data('minWidth', minWidth + 'px');
    }
  },

  /**
   * 显示 select
   *
   * @method show
   */
  showDropdown: function() {
    var self = this,
        roleSelect = self.role('select');

    roleSelect.addClass('focus input-active dropdown-active');

    if (!self.option('multiple')) {
      self.role('selected')
          .addClass('is-label')
          .text(self.data('label') || undefined);
    }

    self.role('dropdown')
        .css({
          width: roleSelect.outerWidth(),
          left: 0,
          top: roleSelect.outerHeight(),
          visibility: 'visible'
        })
        .show();
  },

  /**
   * 隐藏 select
   *
   * @method hide
   */
  hideDropdown: function() {
    var self = this;

    if (self.role('dropdown').is(':hidden')) {
      return;
    }

    self.role('select')
        .removeClass('focus input-active dropdown-active');

    if (!self.option('multiple')) {
      self.role('selected')
          .removeClass('is-label')
          .text(self.text || undefined);
    }

    self.role('dropdown')
        .hide();
  },

  /**
   * 单选
   *
   * @method select
   * @param item
   */
  select: function (item) {
    var self = this,
        datas = self.data('select'),
        index = +item.data('index'),
        i, l;

    if (datas[index].selected) {
      self.hideDropdown();
      return;
    }

    if (datas[index].disabled) {
      return;
    }

    self.text = datas[index].text;

    for (i = 0, l = datas.length; i < l; i++) {
      datas[i].selected = (i === index);
    }

    self.render();
  },

  /**
   * 多选
   *
   * @method check
   */
  check: function (item, isInput) {
    var self = this,
        datas = self.data('select'),
        index = +item.data('index'),
        checked;

    if (datas[index].disabled) {
      return;
    }

    checked = item.find('input').is(':checked');

    datas[index].selected = isInput ? checked : !checked;

    self.render();

    self.showDropdown();
  }

});

module.exports = Select;

function convertSelect (select, value) {
  var i, j, o, option,
      fields, field,
      model = [],
      options = select.options,
      l = options.length,
      selected,
      selectedFound = false;

  for (i = 0; i < l; i++) {
    option = options[i];

    if (!selectedFound) {
      if (value !== null) {
        selected = (value === option.value);
      } else {
        selected = option.defaultSelected && option.selected;
      }
    }

    o = {
      text: option.text,
      value: option.value,
      selected: !selectedFound && selected,
      disabled: option.disabled
    };

    model.push(o);

    if (selected) {
      selectedFound = true;
    }
  }

  // 当所有都没有设置 selected，默认设置第一个
  if (!selectedFound && model.length) {
    model[0].selected = true;
  }

  return model;
}

// 补全 model 对象
function completeModel (model, value) {
  var i, l,
      selected,
      selectedFound = false;

  for (i = 0, l = model.length; i < l; i++) {

    if (value !== null) {
      model[i].selected = (value === model[i].value);
    }

    if (model[i].selected) {
      selectedFound = true;
    }
  }

  if (!selectedFound && model.length) {
    model[0].selected = true;
  }

  return model;
}

function getStringWidth (sibling, data) {
  var i, l, m = 0, n, text, value, dummy, width;

  for (i = 0, l = data.length; i < l; i++) {
    text = data[i].text;
    n = text.replace(/[^\x00-\xff]/g, 'xx').length;
    if (n > m) {
      m = n;
      value = text;
    }
  }

  dummy = $('<div/>')
    .css({
      position: 'absolute',
      left: -9999,
      top: -9999,
      width: 'auto',
      whiteSpace: 'nowrap'
    })
    .html(value.replace(/ /g, '&nbsp;'))
    .insertAfter(sibling),

    width = dummy.width();

  dummy.remove();

  return width;
}

});
