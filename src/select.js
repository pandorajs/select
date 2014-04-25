define(function(require, exports, module) {
	var $ = require('$');
	var Overlay = require('overlay');

	var Select = Overlay.extend({
		defaults: {
			triggerTpl: '<a href="#"></a>',
			classPrefix: 'ue-select',

			// 可多选，为 checkbox 多选
			multiple: false,
			// 分隔符，多选时才有用
			delimiter: ', ',

			placeholder: '请选择',

			// 位置
			baseXY: {
				x: 0,
				y: 1
			},
			selfXY: {
				x: 0,
				y: 0
			},

			name: '',
			value: '',

			effect: 'none',

			template: require('./select.handlebars'),

			delegates: {
				'click': function(e) {
					e.stopPropagation();
				},	
				'click [data-role=item]': function(e) {
					var $target = $(e.currentTarget);
					if (this.option('multiple')) {
						var $check = $target.find('[type=checkbox]');
						$check.trigger('click');
					} else {
						console.log(this)
						this.select($target.data('index'));
					}
					
				},
				'click [type=checkbox]': function(e) {
					e.stopPropagation();
					var $target = $(e.currentTarget);
					var $activeTrigger = $(this.activeTrigger);
					var ret = [];
					var value = [];

					this.element.find(':checked').each(function(item) {
						ret.push($(this).data('text'));
						ret.push($(this).val());
					});
					ret = ret.length ? ret.join(this.option('delimiter')) : this.option('placeholder');
					this.$name.val(value.join(','));

					$activeTrigger.text(ret);
				}
			}

		},

		show: function() {
			this.option('visible', true);
			Select.superclass.show.call(this);
		},

		hide: function() {
			this.option('visible', false);
			Select.superclass.hide.call(this);
		},

		setup: function() {
			var self = this;

			self.initAttrs();
			self.data($.extend(self.option('model'), {multiple: self.option('multiple')}));
			// 下拉框置于 trigger 下方
			this.option('baseElement', this.option('trigger'));
			this.render();
			this._initOptions();
			this._blurHide();
			
		},

		select: function(index) {
			console.log(index)
			this.$origSelect.find('option').each(function(i) {
				var selected = index == i ? 'selected' : '';
				$(this).attr('selected', selected);
			});
			this.hide();
		},

		// 除了 element 和 relativeElements，点击 body 后都会隐藏 element
		_blurHide: function(arr) {
			arr = $.makeArray(arr);
			arr.push(this.element);
			this._relativeElements = arr;
			Select.blurOverlays.push(this);
		},

		_initOptions: function() {
			this.options = this.role('content').children();
		},

		initAttrs: function() {
			var selectName;
			var trigger = this.$origSelect = $(this.option('trigger'));

			if (trigger[0].tagName.toLowerCase() === 'select') {
				var newTrigger = $(this.option('triggerTpl')).addClass(getClassName(this.option('classPrefix'), 'trigger')).text(this.option('placeholder'));

				this.option('trigger', newTrigger);
				// 重新初始 trigger 事件
				this.initTrigger();
				this.option('model', convertSelect(trigger[0], this.option('classPrefix')))

				trigger.after(newTrigger).hide();
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
						}).insertAfter(trigger);
					}
				}
				this.$name = this.$('[name=' + this.option('name') + ']');
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