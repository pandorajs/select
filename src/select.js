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
    field: null,
    label: null,

    css: {
      // width: '200',
      position: 'relative'
    },

    model: [],

    name: null,
    value: null,

    template: require('./select.handlebars'),

    events: {
      render: function() {
        this.element.addClass(
          this.option('classPrefix') + '-' + (this.option('multiple') ? 'multiple' : 'single')
        );
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
        this.input.focus();
        this.showList();
      },
      'click [data-role=item]': function (e) {
        var item = $(e.currentTarget);
        if (this.option('multiple')) {
          item.find('[type=checkbox]').trigger('click');
        } else {
          this.select(item);
        }
      },
      'mouseenter [data-role=item]': function(e) {
        $(e.currentTarget).addClass('active');
      },
      'mouseleave [data-role=item]': function(e) {
        $(e.currentTarget).removeClass('active');
      },
      'click [type=checkbox]': function(e) {
        var item = $(e.currentTarget);

        e.stopPropagation();

        this.check(item);
      }
    }
  },

  setup: function() {
    var self = this,
        field = self.option('field'),
        optionLoad;

    if (!field) {
      throw new Error('请设置field');
    }

    field = self.field = $(field).hide();

    // 存储 field 的 tagName
    self.tagName = field[0].tagName.toLowerCase();
    // 存储当前值
    // self.text = field[0].text;

    if (!self.option('label')) {
      self.option('label', field.data('label'));
    }

    self.on('render', function () {
      this.postRender();
    });

    optionLoad = self.option('load');
    // 异步请求
    if (optionLoad) {
      optionLoad(function (data) {
        self.setDataAndRender(data);
      });
    } else {
      self.initAttrs();
      self.setDataAndRender(self.option('model'));
    }
  },

  setDataAndRender: function (data) {
    var self = this;

    self.data('select', data);
    self.data('multiple', self.option('multiple'));
    self.render();
  },

  postRender: function () {
    var self = this;

    // self.input = self.$('input[type=text]');
    self.input = self.role('selected');

    if (self.option('multiple')) {
      self.initMultiple();
    } else {
      self.initSingle();
    }

    if (self.maxString) {
      self.role('selected').css('min-width',
          getStringWidth(self.role('selected'), self.maxString));
    }

    self.initDelegates({
      'mousedown': function (e) {
        if (!(self.is(e.target) ||
              self.$(e.target).length)) {
          self.hideList();
        }
      }
    }, self.document);
  },

  initSingle: function () {
    var self = this,
        value = self.option('value') || self.field.val(),
        text = self.$('[data-value="' + value + '"]').text();

    // 存储当前值
    self.text = text;

    self.input.text(text)
        .attr('placeholder',
            self.option('placeholder') || self.field.prop('placeholder'));

    // 回填
    self.field.val(value);
  },

  initMultiple: function (undefined) {
    var self = this,
        value = self.option('value') || self.field.val(),
        v;

    if (value) {
      value = value.split(',');

      while ((v = value.shift()) !== undefined) {
        self.$(':checkbox[value="' + v + '"]').trigger('click');
      }
    }
  },

  /**
   * 显示 select
   *
   * @method show
   */
  showList: function() {
    var self = this,
        roleSelect = self.role('select');

    roleSelect.addClass('focus input-active dropdown-active');

    if (self.option('label')) {
      self.input.text(self.option('label'))
          .addClass('label');
    }

    self.role('dropdown').css({
      width: roleSelect.outerWidth(),
      left: 0,
      top: roleSelect.outerHeight(),
      visibility: 'visible'
    }).show();

    self.option('visible', true);
  },

  /**
   * 隐藏 select
   *
   * @method hide
   */
  hideList: function() {
    var self = this;

    self.role('select')
        .removeClass('focus input-active dropdown-active');

    if (self.option('label')) {
      self.input.text(self.text)
          .removeClass('label');
    }

    self.role('dropdown')
        .hide();

    self.option('visible', false);
  },

  /**
   * 单选
   *
   * @method select
   * @param item
   */
  select: function (item) {
    var self = this,
        value = item.data('value') + '',
        origValue = self.field.val(),
        text = item.text(),
        index;

    item.addClass('selected')
        .siblings('.selected').removeClass('selected');

    self.field.val(value);
    self.input.text(text);

    if (origValue !== value) {
      self.fire('change', item);
    }

    self.text = text;
    self.hideList();
  },

  /**
   * 多选
   *
   * @method check
   * @param item
   */
  check: function (item) {
    var self = this,
        html = '',
        values = [];

    self.$(':checked').each(function (item) {
      var value = this.value;

      html += '<div class="item" data-value="' + value + '">' +
                $(this).data('text') +
              '</div>';

      values.push(value);
    });

    self.role('select').toggleClass('has-items', !!values.length);

    self.field.val(values.join(self.option('delimiter')));

    self.role('selected').html(html);

    // 重新设定下拉位置
    self.role('dropdown').css('top',
        self.role('select').outerHeight());
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
        field = self.field,
        tagName = self.tagName,
        model = self.option('model');

    if (tagName === 'select') {
      // option 设置 model 优先级高
      if (model && model.length) {
        self.data('select', completeModel(model, self.option('value'), self));
      } else {
        self.data('select', convertSelect(field[0], self.option('value'), self));
      }
    } else {
      // 如果 name 存在则创建隐藏域
      selectName = self.option('name');

      if (selectName) {
        if ($('input[name="' + selectName + '"]').length === 0) {
          $(
            '<input type="text" name="' + selectName + '" />'
          ).css({
            position: 'absolute',
            left: '-99999px',
            zIndex: -100
          }).insertAfter(field);
        }
      }

      if (!model) {
        throw new Error('option model invalid');
      }

      // trigger 如果为其他 DOM，则由用户提供 model
      self.data('select', completeModel(model, self.option('value'), self));
    }
  }
});

module.exports = Select;

function convertSelect (select, value, scope) {
  var i, j, o, option,
      fields, field,
      model = [],
      options = select.options,
      l = options.length,
      selected,
      selectedFound = false,
      maxlength = 0,
      maxString = '';

  for (i = 0; i < l; i++) {
    option = options[i];

    if (value !== null) {
      selected = (value === option.value);
    } else {
      selected = option.defaultSelected && option.selected;
    }

    if (selected) {
      selectedFound = true;
    }

    o = {
      text: option.text,
      value: option.value,
      selected: selected,
      disabled: option.disabled
    };

    if (o.text.length > maxlength) {
      maxlength = o.text.length;
      maxString = o.text;
    }

    model.push(o);
  }

  scope.maxString = maxString;

  // 当所有都没有设置 selected，默认设置第一个
  if (!selectedFound && model.length) {
    model[0].selected = true;
  }

  return model;
}

// 补全 model 对象
function completeModel (model, value, scope) {
  var i, j, l, ll, o,
      newModel = [],
      selectedIndexes = [],
      maxlength = 0,
      maxString = '';

  for (i = 0, l = model.length; i < l; i++) {
    o = $.extend({}, model[i]);

    if (o.selected) {
      selectedIndexes.push(i);
    }

    o.selected = !!o.selected;
    o.disabled = !!o.disabled;

    if (o.text.length > maxlength) {
      maxlength = o.text.length;
      maxString = o.text;
    }

    newModel.push(o);
  }

  scope.maxString = maxString;

  if (selectedIndexes.length) {
    // 如果有多个 selected 则选中最后一个
    selectedIndexes.pop();
    for (j = 0, ll = selectedIndexes.length; j < ll; j++) {
      newModel[selectedIndexes[j]].selected = false;
    }
  } else { //当所有都没有设置 selected 则默认设置第一个
    newModel[0].selected = true;
  }

  return newModel;
}

function getStringWidth (sibling, value) {
  var dummy = $('<div/>')
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

  return width + 2;
}

});