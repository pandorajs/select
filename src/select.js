define(function(require, exports, module) {
  "use strict";
  /**
   * Select
   *
   * @module Select
   * @type {exports|*}
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
		defaults: {
			classPrefix: 'ue-select',

			// 可多选，为 checkbox 多选
			multiple: false,
			// 分隔符，多选时才有用
			delimiter: ',',

			placeholder: '请选择',

      // input 或 select 元素，必填
      field: null,

			css: {
				width: '200',
				position: 'relative'
			},

			name: null,
			value: null,

			template: require('./select.handlebars'),

			events: {
				'render': function() {
					var multi = this.option('multiple');
					var cls = multi ? 'multi' : 'single';

					this.element.addClass(cls);
				}
			},

      insert: function() {
        this.element.insertAfter($(this.option('field'))).show();
      },

			delegates: {
				'click': function(e) {
					e.stopPropagation();
				},	
				
				'click [data-role=select]': function(e) {
					this.$input.focus();
					this.show();
				},
				'click [data-role=item]': function(e) {
					var $target = $(e.currentTarget);
					if (this.option('multiple')) {
						var $check = $target.find('[type=checkbox]');
						$check.trigger('click');
					} else {
						this.select($target);
					}
					
				},
				'mouseenter [data-role=item]': function(e) {
					var $target = $(e.currentTarget);
					$target.addClass('active');
				},
				'mouseleave [data-role=item]': function(e) {
					var $target = $(e.currentTarget);
					$target.removeClass('active');
				},
				'click [type=checkbox]': function(e) {
					e.stopPropagation();
					var $target = $(e.currentTarget);
					var $activeTrigger = $(this.activeTrigger);
					var html = '';
					var value = [];
					this.element.find(':checked').each(function(item) {
						var val = $(this).val();
						html += '<div class="multi-item" data-value="' + val + '">' + $(this).data('text') + '</div>';
						value.push(val);
					});
					this.toggleInput(value.length);
					this.field.val(value.join(this.option('delimiter')));
					this.role('selectedMulti').html(html);

					// 重新设定下拉位置
					var height = this.$selectInput.outerHeight();
					this.$selectDropdown.css('top', height);
				}
			}
		},
    /**
     * 显示 select
     *
     * @method show
     */
		show: function() {
			var width = this.$selectInput.outerWidth();
			var height = this.$selectInput.outerHeight();

			this.$selectInput.addClass('foucs input-active dropdown-active');
			this.$selectDropdown.css({
				width: width,
				left: 0,
				top: height,
				visibility: 'visible'
			}).show();
			this.option('visible', true);
		},

    /**
     * 隐藏 select
     *
     * @method hide
     */
		hide: function() {
			this.$selectInput && this.$selectInput.removeClass('foucs input-active dropdown-active');
			this.$selectDropdown && this.$selectDropdown.hide();
			this.option('visible', false);
		},

		/*render: function() {
			var self = this,
				content, template = self.option("template");
			if (typeof template === "function") {
				content = template(self.option("data"));
			} else {
				content = self.option("content");
			}
			if (typeof content !== "undefined") {
				self.element.html(content);
			}
			if (!self.rendered) {
				self.element.insertAfter(self.$trigger).show();
				self.rendered = true;
			}
			self.fire("render");

			return self;
		},*/

		setup: function() {
			var self = this;
      var field = this.option('field');

      if (field === null) {
        throw new Error('请设置field');
      }
      if (typeof field === 'string') {
        self.field = $(field);
      } else{
        self.field = field;
      }
			self.field = $(this.option('field')).hide();

			self.initAttrs();
			self.data($.extend(self.option('model'), {multiple: self.option('multiple')}));
			this.render();
			this.$selectInput = this.role('select');
			this.$selectDropdown = this.role('dropdown');
			this.$input = this.$('input[type=text]');
			this._initOptions();
			this._blurHide();
			
		},

    /**
     * 单选
     *
     * @method select
     * @param $target
     */
		select: function($target) {
			var value = $target.data('value') + '';
      var origValue = this.field.val();
			var text = this.$('[data-value=' + value + ']').text();
			if (this.tagName === 'select') {
				var index = $target.data('index');
				this.field.find('option').each(function(i) {
					if (index == i) {
						$(this).attr('selected', 'selected');
					} else {
						$(this).removeAttr('selected');
					}
				});
				
			} else if (this.tagName == 'input') {
				this.field.val(value)
			}
			
			this.$input.val(text);
      if (origValue !== value) {
        this.fire('change', $target);
      }
			this.hide();
		},

    /**
     * 除了 element 和 relativeElements，点击 body 后都会隐藏 element
     *
     * @method _blurHide
     * @private
     * @param arr
     * @private
     */
		_blurHide: function(arr) {
			arr = $.makeArray(arr);
			arr.push(this.element);
			this._relativeElements = arr;
			Select.blurOverlays.push(this);
		},

		/**
		 * 显示后初始已选择值
		 *
		 * @method _initOptions
		 * @private
		 * @return {[type]} [description]
		 */
		_initOptions: function() {
			var self = this;
			var value =  this.option('value');
			var text;

			if (this.option('multiple')) {
				var selectedValue = this.field.val();
				if (selectedValue) {
					selectedValue = selectedValue.split(',');
					$.each(selectedValue, function(i, n) {
						self.$('[type=checkbox]').each(function() {
							var $self = $(this);
							if ($self.val() == i) {
								$self.trigger('click');
								return false;
							}
						});
					});
				} 
				this.toggleInput(!!selectedValue);
			} else {
				if (value) {
					text = this.$('[data-value=' + value + ']').text();
				}
				if (this.tagName == 'input') {
					value = value ? value : this.field.val();
					text = this.$('[data-value=' + value + ']').text();
				}
				this.$input.val(text).attr('placeholder', this.option('placeholder'));
			}
		},

		toggleInput: function(hasVal) {
			if (hasVal) {
				this.$input.css({
					width: 4,
					position: 'relative',
					left: 0
				}).removeAttr('placeholder');
			} else {
				this.$input.css('width', '120px').attr('placeholder', this.option('placeholder'));
			}
		},

		/**
		 * 显示之前初始属性值
		 *
		 * @method initAttrs
		 * @return {[type]} [description]
		 */
		initAttrs: function() {
			var selectName;
			var field = $(this.option('field'));
			var tagName = this.tagName = field[0].tagName.toLowerCase();

			if (tagName === 'select') {

				this.option('model', convertSelect(field[0], this.option('classPrefix')));
			} else {
				// 如果 name 存在则创建隐藏域
				selectName = this.option('name');
				if (selectName) {
					var input = $('input[name="' + selectName + '"]').eq(0);
					if (!input[0]) {
						input = $(
							'<input type="text" name="' + selectName + '" />'
						).css({
							position: 'absolute',
							left: '-99999px',
							zIndex: -100
						}).insertAfter(field);
					}
				}
				// trigger 如果为其他 DOM，则由用户提供 model
				this.option('model', completeModel(this.option('model'), this.option('classPrefix'))) 
			}

		}

		
	});

	module.exports = Select;

	// 绑定 blur 隐藏事件
	Select.blurOverlays = [];
	$(document).on('click', function(e) {
		hideBlurOverlays(e);
	});

	// 获取 className ，如果 classPrefix 不设置，就返回 ''
	function getClassName(classPrefix, className) {
		if (!classPrefix) {
			return '';
		}
		return classPrefix + '-' + className;
	}

	function convertSelect(select, classPrefix) {
		var i, model = [],
			options = select.options,
			l = options.length,
			hasDefaultSelect = false;
		for (i = 0; i < l; i++) {
			var j, o = {}, option = options[i];
			var fields = ['text', 'value', 'defaultSelected', 'selected', 'disabled'];
			for (j in fields) {
				var field = fields[j];
				o[field] = option[field];
			}
			if (option.selected) {
				hasDefaultSelect = true;
			}
			model.push(o);
		}
		// 当所有都没有设置 selected，默认设置第一个
		if (!hasDefaultSelect && model.length) {
			model[0].selected = 'true';
		}
		return {
			select: model,
			classPrefix: classPrefix
		};
	}

	// 补全 model 对象
	function completeModel(model, classPrefix) {
		var i, j, l, ll, newModel = [],
			selectIndexArray = [];
		for (i = 0, l = model.length; i < l; i++) {
			var o = $.extend({}, model[i]);
			if (o.selected) {
				selectIndexArray.push(i);
			}
			o.selected = o.defaultSelected = !! o.selected;
			o.disabled = !! o.disabled;
			newModel.push(o);
		}
		if (selectIndexArray.length > 0) {
			// 如果有多个 selected 则选中最后一个
			selectIndexArray.pop();
			for (j = 0, ll = selectIndexArray.length; j < ll; j++) {
				newModel[selectIndexArray[j]].selected = false;
			}
		} else { //当所有都没有设置 selected 则默认设置第一个
			newModel[0].selected = true;
		}
		return {
			select: newModel,
			classPrefix: classPrefix
		};
	}

	function hideBlurOverlays(e) {
		$(Select.blurOverlays).each(function(index, item) {
			// 当实例为空或隐藏时，不处理
			if (!item || !item.option('visible')) {
				return;
			}

			// 遍历 _relativeElements ，当点击的元素落在这些元素上时，不处理
			for (var i = 0; i < item._relativeElements.length; i++) {
				var el = $(item._relativeElements[i])[0];
				if (el === e.target || $.contains(el, e.target)) {
					return;
				}
			}

			// 到这里，判断触发了元素的 blur 事件，隐藏元素
			item.hide();
		});
	}

});