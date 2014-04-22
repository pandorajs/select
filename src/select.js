define(function(require, exports, module) {
	var $ = require('$');
	var Widget = require('widget');
	var Position = require('position');

	var Select = Widget.extend({
		defaults: {
			triggerTpl: '<a href="#"></a>',
			classPrefix: 'ue-select',

			// 定位配置
			align: {
				// element 的定位点，默认为左上角
				selfXY: [0, 0],
				// 基准定位元素，默认为当前可视区域
				baseElement: Position.VIEWPORT,
				// 基准定位元素的定位点，默认为左上角
				baseXY: [0, '100%-1px']
			},

			// 可多选，为 checkbox 多选
			multiple: true,

			name: '',
			value: '',

			template: require('./select.handlebars'),

			delegates: {
				
			}

		},

		setup: function() {
			var self = this;

			self.initAttrs();
			self.data($.extend(self.option('model'), {multiple: self.option('multiple')}));
			this.render();

			this.after('show', function() {
				self._setPosition();
			});
			//this._setPosition();
		},

		initAttrs: function() {
			var selectName;
			var trigger = $(this.option('trigger'));

			if (trigger[0].tagName.toLowerCase() === 'select') {
				var newTrigger = $(this.option('triggerTpl')).addClass(getClassName(this.option('classPrefix'), 'trigger'));
				this.__options.trigger = newTrigger;
				this.__options.model = convertSelect(trigger[0], this.option('classPrefix'));

				trigger.after(newTrigger).hide();
			} else {
				// 如果 name 存在则创建隐藏域
				selectName = this.option('name');
				if (selectName) {
					var input = $('input[name="' + selectName + '"]').eq(0);
					if (!input[0]) {
						input = $(
							'<input type="text" id="select-' + selectName.replace(/\./g, '-') +
							'" name="' + selectName +
							'" />'
						).css({
							position: 'absolute',
							left: '-99999px',
							zIndex: -100
						}).insertAfter(trigger);
					}
				}

				// trigger 如果为其他 DOM，则由用户提供 model
				this.__options.model = completeModel(this.option('model'), this.option('classPrefix'));
			}
		},

		_setPosition: function() {
			// 不在文档流中，定位无效
			if (!isInDocument(this.element[0])) {
				return;
			} 

			//align || (align = this.option('align'));
			var align = this.option('align');

			// 如果align为空，表示不需要使用js对齐
			if (!align) {
				return;
			}

			var isHidden = this.element.css('display') === 'none';

			// 在定位时，为避免元素高度不定，先显示出来
			if (isHidden) {
				this.element.css({
					visibility: 'hidden',
					display: 'block'
				});
			}

			// 调整 align 属性的默认值, 在 trigger 下方
			align.baseElement = this.option('trigger');

			Position.pin({
				element: this.element,
				x: align.selfXY[0],
				y: align.selfXY[1]
			}, {
				element: align.baseElement,
				x: align.baseXY[0],
				y: align.baseXY[1]
			});

			// 定位完成后，还原
			if (isHidden) {
				this.element.css({
					visibility: '',
					display: 'none'
				});
			}

			return this;
		}
	});

	module.exports = Select;

	// 获取 className ，如果 classPrefix 不设置，就返回 ''
	function getClassName(classPrefix, className) {
		if (!classPrefix) {
			return '';
		}
		return classPrefix + '-' + className;
	}

	function isInDocument(element) {
		return $.contains(document.documentElement, element);
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

});