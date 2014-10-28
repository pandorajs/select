define("pandora/select/1.1.0/select-debug", [ "$-debug", "./sifter-debug", "./select-items-debug.handlebars", "pandora/widget/1.0.0/widget-debug", "pandora/base/1.0.0/base-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug", "./select-debug.handlebars", "./select-single-item-debug.handlebars", "./select-multi-item-debug.handlebars" ], function(require, exports, module) {
    "use strict";
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
    var $ = require("$-debug"), Sifter = require("./sifter-debug"), itemsTemplate = require("./select-items-debug.handlebars"), Widget = require("pandora/widget/1.0.0/widget-debug");
    var KEY_MAP = {
        BACKSPACE: 8,
        ENTER: 13,
        UP: 38,
        DOWN: 40
    };
    var SELECTED = "selected";
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
     * 默认参数
     *
     * @property {object} defaults
     * @type {object}
     */
        defaults: {
            classPrefix: "ue-select",
            // 可多选，为 checkbox 多选
            multiple: false,
            // 分隔符，多选时才有用
            delimiter: ",",
            // select label 文本
            placeholder: "请选择",
            search: false,
            hasOptionAll: false,
            // 显示 label 文本，只用在根据原生的select初始的
            hasLabel: false,
            defaultText: "全部",
            sifterOptions: {
                fields: [ "text" ],
                placeholder: "请输入...",
                emptyTemplate: "无匹配项",
                limit: 1e3
            },
            // input 或 select 元素，必填
            // field: null,
            // label: null,
            css: {
                // width: '200',
                position: "relative"
            },
            model: [],
            // name: null,
            // value: null,
            minWidth: null,
            maxWidth: 200,
            template: require("./select-debug.handlebars"),
            templateOptions: {
                partials: {
                    singleItem: require("./select-single-item-debug.handlebars"),
                    multiItem: require("./select-multi-item-debug.handlebars")
                }
            },
            insert: function() {
                this.element.insertAfter(this.option("field")).show();
            },
            delegates: {
                "click [data-role=select]": function(e) {
                    e.stopPropagation();
                    if (this.showSelect) {
                        this.hideDropdown();
                    } else {
                        this.showDropdown();
                        this.role("placeholder").focus();
                    }
                },
                "keyup [data-role=placeholder]": "onKey",
                "click [data-role=item]": function(e) {
                    if (e.currentTarget.tagName === "LABEL") {
                        e.stopPropagation();
                        this.check($(e.currentTarget), e.target.tagName === "INPUT");
                    } else {
                        this.select($(e.currentTarget));
                    }
                },
                "mouseenter [data-role=item]": function(e) {
                    $(e.currentTarget).addClass("active");
                },
                "mouseleave [data-role=item]": function(e) {
                    $(e.currentTarget).removeClass("active");
                }
            }
        },
        // sifter 查询
        search: function() {
            if (this.disableKey) {
                return false;
            }
            var self = this;
            var result = self.searchResult = self.sifter.search($.trim(self.searchInput.val()), self.option("sifterOptions"));
            var items = result.items;
            var data = [];
            // 按原始数据顺序排序
            items.sort(function(obj1, obj2) {
                var v1 = obj1.id;
                var v2 = obj2.id;
                if (v1 < v2) {
                    return -1;
                } else if (v1 > v2) {
                    return 1;
                } else {
                    return 0;
                }
            });
            $.each(items, function(i, n) {
                var item = self.sifter.items[n.id];
                var reg = new RegExp(result.query, "ig");
                item.item = item.text.replace(reg, function(query) {
                    return '<span class="highlight">' + query + "</span>";
                });
                data.push(item);
            });
            self.renderDropdown(data);
        },
        // 按了后退键
        keyBack: function() {
            this.disableKey = false;
            this.search();
            if (this.searchInput.val() === "") {
                this.showPlaceholder();
            }
        },
        // 显示 sifter 输入框
        showPlaceholder: function() {
            /*if (this.text === this.option('defaultText')) {
        return;
      }*/
            var self = this;
            var width = getStringWidth(self.role("selected"), self.data("select"));
            self.maxLength || (self.maxLength = getMaxLength(self.data("select")));
            self.role("single-text").hide();
            self.activeInput = true;
            self.clearValue();
            self.searchInput.css("width", width).attr("maxlength", self.maxLength).attr("placeholder", self.option("sifterOptions/placeholder"));
        },
        hidePlaceholder: function() {
            if (this.value === null && this.text === null) {
                this.role("select").addClass("is-label");
            }
            this.searchInput.removeAttr("placeholder");
        },
        // 按了 enter 键
        keyEnter: function(e) {
            this.role("item").each(function() {
                if ($(this).hasClass(SELECTED)) {
                    $(this).trigger("click");
                    return false;
                }
            });
        },
        // 按了向上键
        keyUp: function() {
            var index;
            var $item = this.role("item");
            $item.each(function(i) {
                if ($(this).hasClass(SELECTED) && i > 0) {
                    index = i - 1;
                    $(this).removeClass(SELECTED);
                    return false;
                }
            });
            $item.eq(index).addClass(SELECTED);
        },
        // 按了向下键
        keyDown: function() {
            var index;
            var $item = this.role("item");
            $item.each(function(i) {
                if ($(this).hasClass(SELECTED) && i < $item.length - 1) {
                    index = i + 1;
                    $(this).removeClass(SELECTED);
                    return false;
                }
            });
            $item.eq(index).addClass(SELECTED);
        },
        onKey: function(e) {
            if (!this.option("search")) {
                return;
            }
            switch (e.keyCode) {
              case KEY_MAP.BACKSPACE:
                this.keyBack();
                break;

              case KEY_MAP.ENTER:
                this.keyEnter();
                break;

              case KEY_MAP.UP:
                this.keyUp();
                break;

              case KEY_MAP.DOWN:
                this.keyDown();
                break;

              default:
                this.search();
                break;
            }
        },
        // 根据搜索内容显示下拉
        renderDropdown: function(data) {
            this.$(".dropdown-content").html(itemsTemplate({
                items: data,
                emptyTemplate: this.option("sifterOptions/emptyTemplate")
            }));
        },
        setup: function() {
            var self = this, field = self.option("field"), optionLoad;
            if (!field) {
                throw new Error("field is invalid");
            }
            field = self.field = $(field).hide();
            // 存储 field 的 tagName
            self.tagName = field[0].tagName.toLowerCase();
            self.data("hasSelected", !!self.option("value") || !!field.val());
            self.option("placeholder", field.attr("placeholder"));
            self.data("label", self.option("label") || field.data("label") || self.option("placeholder"));
            self.once("render", function() {
                self.element.addClass(self.option("classPrefix") + "-" + (self.option("multiple") ? "multiple" : "single"));
                self.initDelegates({
                    mousedown: function(e) {
                        if (!(self.is(e.target) || self.$(e.target).length)) {
                            self.showSelect && self.hideDropdown();
                        }
                    }
                }, self.document);
            });
            optionLoad = self.option("load");
            // 异步请求
            if (optionLoad) {
                optionLoad.call(self, function(data) {
                    self.option("model", data);
                    self.initAttrs();
                    self.setDataSelect();
                });
            } else {
                self.initAttrs();
                self.setDataSelect();
            }
        },
        setValue: function(value) {
            this.role("item").filter('[data-value="' + value + '"]').trigger("click");
        },
        setPlaceholder: function() {
            if (this.activeInput) {
                return;
            }
            var attrs;
            if (this.showSelect) {
                attrs = {
                    width: "4px",
                    opacity: 1,
                    position: "relative",
                    left: 0
                };
            } else {
                attrs = {
                    width: "4px",
                    opacity: 0,
                    position: "absolute",
                    left: "-10000px"
                };
            }
            this.searchInput.css(attrs);
        },
        /**
     * 初始化属性值
     *
     * @method initAttrs
     * @private
     */
        initAttrs: function() {
            var self = this, selectName, selectElem, field = self.field, tagName = self.tagName, model = self.option("model"), multiple = self.option("multiple"), value = self.option("value") || field.attr("value") || field.val() || null;
            if (tagName === "select") {
                // 是否默认选中第一个
                value = self.option("hasLabel") ? field.attr("value") : field.val();
                // option 设置 model 优先级高
                if (model && model.length) {
                    self.data("select", completeModel(model, value));
                } else {
                    self.data("select", convertSelect(field[0], value));
                    self.option("model", convertSelect(field[0], value));
                }
            } else {
                if (!model || !model.length) {
                    throw new Error("option model invalid");
                }
                if (self.option("hasOptionAll")) {
                    model.unshift({
                        value: "",
                        text: self.option("defaultText")
                    });
                }
                // trigger 如果为其他 DOM，则由用户提供 model
                self.data("select", completeModel(model, value));
                // 如果 name 存在则创建隐藏域
                selectName = self.option("name");
                if (selectName) {
                    selectElem = $('[name="' + selectName + '"]', self.viewport);
                    if (selectElem.length === 0) {
                        selectElem = $('<input type="hidden" name="' + selectName + '" />', self.viewport).css({
                            position: "absolute",
                            zIndex: -1
                        }).insertAfter(field);
                    }
                    self.field = selectElem;
                }
            }
        },
        /**
     * 设置下拉选项数据
     *
     * @method setDataSelect
     * @private
     */
        setDataSelect: function() {
            var self = this;
            var data = self.option("model");
            self.data({
                select: data,
                maxWidth: self.option("maxWidth") + "px",
                search: self.option("search"),
                multiple: self.option("multiple")
            });
            if (self.option("search")) {
                self.sifter = new Sifter(data);
            }
            self.render();
        },
        /**
     * 渲染
     *
     * @method render
     */
        render: function() {
            this.initValue();
            Select.superclass.render.apply(this);
            this.setWidth();
            if (this.option("search")) {
                this.searchInput = this.role("placeholder");
                //this.value === null && this.showPlaceholder();
                this.setPlaceholder();
                this.bindKeyEvents();
            }
        },
        bindKeyEvents: function() {
            var self = this;
            self.searchInput.off("keydown").on("keydown", function(e) {
                if (self.value !== null || self.text !== null) {
                    // 禁止输入
                    self.disableKey = true;
                    return false;
                }
            });
        },
        /**
     * 回填 value
     *
     * @method initValue
     * @private
     */
        initValue: function() {
            var self = this, datas = self.data("select"), i, l, values = [], newValue, hasSelected = false;
            for (i = 0, l = datas.length; i < l; i++) {
                if (datas[i].selected) {
                    self.text = datas[i].text;
                    values.push(datas[i].value);
                    hasSelected = true;
                }
            }
            newValue = values.join(self.option("delimiter")) || null;
            self.data("hasSelected", hasSelected);
            if (typeof self.value === "undefined") {
                // 为空值就转为 null
                self.value = self.field.val() || null;
            }
            self.field.val(newValue || "");
            if (self.value !== newValue) {
                self.value = newValue;
                self.field.change();
                self.fire("change");
            }
        },
        /**
     * 清空值
     */
        clearValue: function() {
            var self = this, data = self.data("select"), i, l;
            for (i = 0, l = data.length; i < l; i++) {
                data[i].selected = false;
            }
            self.data("hasSelected", false);
            self.value = null;
            self.text = null;
            self.field.val("");
            self.searchInput.val("");
        },
        /**
     * 设置组件宽度
     *
     * @method setWidth
     * @private
     */
        setWidth: function() {
            var self = this, WIDTH_INPUT = self.option("search") ? 6 : 0, minWidth = self.option("minWidth"), maxWidth = self.option("maxWidth"), calWidth;
            if (!minWidth) {
                // 6 是 search input 的最小宽度
                minWidth = (self.option("multiple") ? 20 : WIDTH_INPUT) + getStringWidth(self.role("selected"), self.data("select"));
            }
            // 设置宽度同时保存到data备用
            if (maxWidth) {
                if (minWidth >= maxWidth) {
                    self.role("selected").css("width", maxWidth);
                    self.data("width", maxWidth + "px");
                    self.role("single-text").css("max-width", maxWidth - WIDTH_INPUT);
                } else {
                    self.role("selected").css("min-width", minWidth).css("max-width", maxWidth);
                    self.role("single-text").css("max-width", maxWidth - WIDTH_INPUT);
                    self.data("minWidth", minWidth + "px");
                    self.data("maxWidth", maxWidth + "px");
                }
            } else {
                self.role("selected").css("min-width", minWidth);
                self.role("single-text").css("max-width", minWidth - WIDTH_INPUT);
                self.data("minWidth", minWidth + "px");
            }
        },
        /**
     * 显示 select
     *
     * @method show
     * @private
     */
        showDropdown: function() {
            var self = this, roleSelect = self.role("select");
            roleSelect.addClass("focus input-active dropdown-active");
            if (!self.option("multiple")) {
                self.role("selected").addClass("is-label");
                self.role("single-text").text(self.text || undefined);
            }
            self.role("dropdown").css({
                width: roleSelect.outerWidth(),
                left: 0,
                top: roleSelect.outerHeight(),
                visibility: "visible"
            }).show();
            self.showSelect = true;
            if (self.option("search")) {
                self.setPlaceholder();
                if (!self.value && !self.text) {
                    //var data = self.option('select');
                    self.showPlaceholder();
                    /*var i, l;
          for (i = 0, l = data.length; i < l; i++) {
            data[i].index = i;
          }*/
                    self.renderDropdown(self.data("select"));
                }
            }
        },
        /**
     * 隐藏 select
     *
     * @method hide
     * @private
     */
        hideDropdown: function() {
            var self = this;
            if (self.role("dropdown").is(":hidden")) {
                return;
            }
            self.showSelect = false;
            self.role("select").removeClass("focus input-active dropdown-active");
            if (!self.option("multiple")) {
                if (self.option("search")) {
                    self.activeInput = false;
                    self.setPlaceholder();
                    self.hidePlaceholder();
                }
                self.role("selected").removeClass("is-label");
                self.role("single-text").show().text(self.text || self.option("placeholder"));
            }
            self.role("dropdown").hide();
        },
        /**
     * 单选
     *
     * @method select
     * @param item
     * @private
     */
        select: function(item) {
            var self = this, datas = self.data("select"), index = +item.data("index"), i, l;
            if (datas[index].selected) {
                self.hideDropdown();
                return;
            }
            if (datas[index].disabled) {
                return;
            }
            self.text = datas[index].text;
            for (i = 0, l = datas.length; i < l; i++) {
                datas[i].selected = i === index;
            }
            self.activeInput = false;
            self.showSelect = false;
            self.render();
        },
        /**
     * 多选
     *
     * @method check
     * @private
     */
        check: function(item, isInput) {
            var self = this, datas = self.data("select"), index = +item.data("index"), checked;
            if (datas[index].disabled) {
                return;
            }
            checked = item.find("input").is(":checked");
            datas[index].selected = isInput ? checked : !checked;
            self.render();
            self.showDropdown();
        }
    });
    module.exports = Select;
    function convertSelect(select, value) {
        var i, o, option, model = [], options = select.options, l = options.length, selected, selectedFound = false;
        for (i = 0; i < l; i++) {
            option = options[i];
            if (!selectedFound) {
                if (value !== null) {
                    selected = value === option.value;
                } else {
                    selected = option.defaultSelected && option.selected;
                }
            }
            o = {
                text: option.text,
                index: i,
                value: option.value,
                selected: !selectedFound && selected,
                disabled: option.disabled
            };
            model.push(o);
            if (selected) {
                selectedFound = true;
            }
        }
        return model;
    }
    // 补全 model 对象
    function completeModel(model, value) {
        var i, l;
        for (i = 0, l = model.length; i < l; i++) {
            model[i].index = i;
            if (value !== null) {
                model[i].selected = value === model[i].value;
            }
        }
        return model;
    }
    function getMaxLength(data) {
        var i, l, m = 0, n, text;
        for (i = 0, l = data.length; i < l; i++) {
            text = data[i].text;
            n = text.replace(/[^\x00-\xff]/g, "xx").length;
            if (n > m) {
                m = n;
            }
        }
        return n;
    }
    function getStringWidth(sibling, data) {
        var i, l, m = 0, n, text, value, dummy, width;
        for (i = 0, l = data.length; i < l; i++) {
            text = data[i].text;
            n = text.replace(/[^\x00-\xff]/g, "xx").length;
            if (n > m) {
                m = n;
                value = text;
            }
        }
        dummy = $("<div/>").css({
            position: "absolute",
            left: -9999,
            top: -9999,
            width: "auto",
            whiteSpace: "nowrap"
        }).html(value.replace(/ /g, "&nbsp;")).insertAfter(sibling), width = dummy.width();
        dummy.remove();
        return width;
    }
});

define("pandora/select/1.1.0/sifter-debug", [], function(require, exports, module) {
    /**
 * sifter.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */
    (function(root, factory) {
        if (typeof define === "function" && define.amd) {
            define(factory);
        } else if (typeof exports === "object") {
            module.exports = factory();
        } else {
            root.Sifter = factory();
        }
    })(this, function() {
        /**
	 * Textually searches arrays and hashes of objects
	 * by property (or multiple properties). Designed
	 * specifically for autocomplete.
	 *
	 * @constructor
	 * @param {array|object} items
	 * @param {object} items
	 */
        var Sifter = function(items, settings) {
            this.items = items;
            this.settings = settings || {
                diacritics: true
            };
        };
        /**
	 * Splits a search string into an array of individual
	 * regexps to be used to match results.
	 *
	 * @param {string} query
	 * @returns {array}
	 */
        Sifter.prototype.tokenize = function(query) {
            query = trim(String(query || "").toLowerCase());
            if (!query || !query.length) return [];
            var i, n, regex, letter;
            var tokens = [];
            var words = query.split(/ +/);
            for (i = 0, n = words.length; i < n; i++) {
                regex = escape_regex(words[i]);
                if (this.settings.diacritics) {
                    for (letter in DIACRITICS) {
                        if (DIACRITICS.hasOwnProperty(letter)) {
                            regex = regex.replace(new RegExp(letter, "g"), DIACRITICS[letter]);
                        }
                    }
                }
                tokens.push({
                    string: words[i],
                    regex: new RegExp(regex, "i")
                });
            }
            return tokens;
        };
        /**
	 * Iterates over arrays and hashes.
	 *
	 * ```
	 * this.iterator(this.items, function(item, id) {
	 *    // invoked for each item
	 * });
	 * ```
	 *
	 * @param {array|object} object
	 */
        Sifter.prototype.iterator = function(object, callback) {
            var iterator;
            if (is_array(object)) {
                iterator = Array.prototype.forEach || function(callback) {
                    for (var i = 0, n = this.length; i < n; i++) {
                        callback(this[i], i, this);
                    }
                };
            } else {
                iterator = function(callback) {
                    for (var key in this) {
                        if (this.hasOwnProperty(key)) {
                            callback(this[key], key, this);
                        }
                    }
                };
            }
            iterator.apply(object, [ callback ]);
        };
        /**
	 * Returns a function to be used to score individual results.
	 *
	 * Good matches will have a higher score than poor matches.
	 * If an item is not a match, 0 will be returned by the function.
	 *
	 * @param {object|string} search
	 * @param {object} options (optional)
	 * @returns {function}
	 */
        Sifter.prototype.getScoreFunction = function(search, options) {
            var self, fields, tokens, token_count;
            self = this;
            search = self.prepareSearch(search, options);
            tokens = search.tokens;
            fields = search.options.fields;
            token_count = tokens.length;
            /**
		 * Calculates how close of a match the
		 * given value is against a search token.
		 *
		 * @param {mixed} value
		 * @param {object} token
		 * @return {number}
		 */
            var scoreValue = function(value, token) {
                var score, pos;
                if (!value) return 0;
                value = String(value || "");
                pos = value.search(token.regex);
                if (pos === -1) return 0;
                score = token.string.length / value.length;
                if (pos === 0) score += .5;
                return score;
            };
            /**
		 * Calculates the score of an object
		 * against the search query.
		 *
		 * @param {object} token
		 * @param {object} data
		 * @return {number}
		 */
            var scoreObject = function() {
                var field_count = fields.length;
                if (!field_count) {
                    return function() {
                        return 0;
                    };
                }
                if (field_count === 1) {
                    return function(token, data) {
                        return scoreValue(data[fields[0]], token);
                    };
                }
                return function(token, data) {
                    for (var i = 0, sum = 0; i < field_count; i++) {
                        sum += scoreValue(data[fields[i]], token);
                    }
                    return sum / field_count;
                };
            }();
            if (!token_count) {
                return function() {
                    return 0;
                };
            }
            if (token_count === 1) {
                return function(data) {
                    return scoreObject(tokens[0], data);
                };
            }
            if (search.options.conjunction === "and") {
                return function(data) {
                    var score;
                    for (var i = 0, sum = 0; i < token_count; i++) {
                        score = scoreObject(tokens[i], data);
                        if (score <= 0) return 0;
                        sum += score;
                    }
                    return sum / token_count;
                };
            } else {
                return function(data) {
                    for (var i = 0, sum = 0; i < token_count; i++) {
                        sum += scoreObject(tokens[i], data);
                    }
                    return sum / token_count;
                };
            }
        };
        /**
	 * Returns a function that can be used to compare two
	 * results, for sorting purposes. If no sorting should
	 * be performed, `null` will be returned.
	 *
	 * @param {string|object} search
	 * @param {object} options
	 * @return function(a,b)
	 */
        Sifter.prototype.getSortFunction = function(search, options) {
            var i, n, self, field, fields, fields_count, multiplier, multipliers, get_field, implicit_score, sort;
            self = this;
            search = self.prepareSearch(search, options);
            sort = !search.query && options.sort_empty || options.sort;
            /**
		 * Fetches the specified sort field value
		 * from a search result item.
		 *
		 * @param  {string} name
		 * @param  {object} result
		 * @return {mixed}
		 */
            get_field = function(name, result) {
                if (name === "$score") return result.score;
                return self.items[result.id][name];
            };
            // parse options
            fields = [];
            if (sort) {
                for (i = 0, n = sort.length; i < n; i++) {
                    if (search.query || sort[i].field !== "$score") {
                        fields.push(sort[i]);
                    }
                }
            }
            // the "$score" field is implied to be the primary
            // sort field, unless it's manually specified
            if (search.query) {
                implicit_score = true;
                for (i = 0, n = fields.length; i < n; i++) {
                    if (fields[i].field === "$score") {
                        implicit_score = false;
                        break;
                    }
                }
                if (implicit_score) {
                    fields.unshift({
                        field: "$score",
                        direction: "desc"
                    });
                }
            } else {
                for (i = 0, n = fields.length; i < n; i++) {
                    if (fields[i].field === "$score") {
                        fields.splice(i, 1);
                        break;
                    }
                }
            }
            multipliers = [];
            for (i = 0, n = fields.length; i < n; i++) {
                multipliers.push(fields[i].direction === "desc" ? -1 : 1);
            }
            // build function
            fields_count = fields.length;
            if (!fields_count) {
                return null;
            } else if (fields_count === 1) {
                field = fields[0].field;
                multiplier = multipliers[0];
                return function(a, b) {
                    return multiplier * cmp(get_field(field, a), get_field(field, b));
                };
            } else {
                return function(a, b) {
                    var i, result, a_value, b_value, field;
                    for (i = 0; i < fields_count; i++) {
                        field = fields[i].field;
                        result = multipliers[i] * cmp(get_field(field, a), get_field(field, b));
                        if (result) return result;
                    }
                    return 0;
                };
            }
        };
        /**
	 * Parses a search query and returns an object
	 * with tokens and fields ready to be populated
	 * with results.
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
        Sifter.prototype.prepareSearch = function(query, options) {
            if (typeof query === "object") return query;
            options = extend({}, options);
            var option_fields = options.fields;
            var option_sort = options.sort;
            var option_sort_empty = options.sort_empty;
            if (option_fields && !is_array(option_fields)) options.fields = [ option_fields ];
            if (option_sort && !is_array(option_sort)) options.sort = [ option_sort ];
            if (option_sort_empty && !is_array(option_sort_empty)) options.sort_empty = [ option_sort_empty ];
            return {
                options: options,
                query: String(query || "").toLowerCase(),
                tokens: this.tokenize(query),
                total: 0,
                items: []
            };
        };
        /**
	 * Searches through all items and returns a sorted array of matches.
	 *
	 * The `options` parameter can contain:
	 *
	 *   - fields {string|array}
	 *   - sort {array}
	 *   - score {function}
	 *   - filter {bool}
	 *   - limit {integer}
	 *
	 * Returns an object containing:
	 *
	 *   - options {object}
	 *   - query {string}
	 *   - tokens {array}
	 *   - total {int}
	 *   - items {array}
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
        Sifter.prototype.search = function(query, options) {
            var self = this, value, score, search, calculateScore;
            var fn_sort;
            var fn_score;
            search = this.prepareSearch(query, options);
            options = search.options;
            query = search.query;
            // generate result scoring function
            fn_score = options.score || self.getScoreFunction(search);
            // perform search and sort
            if (query.length) {
                self.iterator(self.items, function(item, id) {
                    score = fn_score(item);
                    if (options.filter === false || score > 0) {
                        search.items.push({
                            score: score,
                            id: id
                        });
                    }
                });
            } else {
                self.iterator(self.items, function(item, id) {
                    search.items.push({
                        score: 1,
                        id: id
                    });
                });
            }
            fn_sort = self.getSortFunction(search, options);
            if (fn_sort) search.items.sort(fn_sort);
            // apply limits
            search.total = search.items.length;
            if (typeof options.limit === "number") {
                search.items = search.items.slice(0, options.limit);
            }
            return search;
        };
        // utilities
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        var cmp = function(a, b) {
            if (typeof a === "number" && typeof b === "number") {
                return a > b ? 1 : a < b ? -1 : 0;
            }
            a = String(a || "").toLowerCase();
            b = String(b || "").toLowerCase();
            if (a > b) return 1;
            if (b > a) return -1;
            return 0;
        };
        var extend = function(a, b) {
            var i, n, k, object;
            for (i = 1, n = arguments.length; i < n; i++) {
                object = arguments[i];
                if (!object) continue;
                for (k in object) {
                    if (object.hasOwnProperty(k)) {
                        a[k] = object[k];
                    }
                }
            }
            return a;
        };
        var trim = function(str) {
            return (str + "").replace(/^\s+|\s+$|/g, "");
        };
        var escape_regex = function(str) {
            return (str + "").replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        };
        var is_array = Array.isArray || $ && $.isArray || function(object) {
            return Object.prototype.toString.call(object) === "[object Array]";
        };
        var DIACRITICS = {
            a: "[aÀÁÂÃÄÅàáâãäåĀā]",
            c: "[cÇçćĆčČ]",
            d: "[dđĐďĎ]",
            e: "[eÈÉÊËèéêëěĚĒē]",
            i: "[iÌÍÎÏìíîïĪī]",
            n: "[nÑñňŇ]",
            o: "[oÒÓÔÕÕÖØòóôõöøŌō]",
            r: "[rřŘ]",
            s: "[sŠš]",
            t: "[tťŤ]",
            u: "[uÙÚÛÜùúûüůŮŪū]",
            y: "[yŸÿýÝ]",
            z: "[zŽž]"
        };
        // export
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        return Sifter;
    });
});

define("pandora/select/1.1.0/select-items-debug.handlebars", [ "gallery/handlebars/1.3.0/handlebars-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-debug");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n  ";
            stack1 = helpers.each.call(depth0, depth0 && depth0.items, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n";
            return buffer;
        }
        function program2(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\n  <div title="';
            if (helper = helpers.text) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.text;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" class="item" data-index="';
            if (helper = helpers.index) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.index;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" data-role="item" data-value="';
            if (helper = helpers.value) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.value;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '">\n    ';
            stack1 = helpers["if"].call(depth0, depth0 && depth0.item, {
                hash: {},
                inverse: self.program(5, program5, data),
                fn: self.program(3, program3, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n  </div>\n  ";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += "\n      ";
            if (helper = helpers.item) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.item;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n    ";
            return buffer;
        }
        function program5(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += "\n      ";
            if (helper = helpers.text) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.text;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n    ";
            return buffer;
        }
        function program7(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\n  <div class="item" data-role="empty">';
            if (helper = helpers.emptyTemplate) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.emptyTemplate;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</div>\n";
            return buffer;
        }
        stack1 = helpers["if"].call(depth0, depth0 && depth0.items, {
            hash: {},
            inverse: self.program(7, program7, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            return stack1;
        } else {
            return "";
        }
    });
});

define("pandora/select/1.1.0/select-debug.handlebars", [ "gallery/handlebars/1.3.0/handlebars-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-debug");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        partials = partials || Handlebars.partials;
        data = data || {};
        var buffer = "", stack1, helper, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            return "has-items";
        }
        function program3(depth0, data) {
            return "is-label";
        }
        function program5(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n      ";
            stack1 = helpers["if"].call(depth0, depth0 && depth0.multiple, {
                hash: {},
                inverse: self.program(10, program10, data),
                fn: self.program(6, program6, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n    ";
            return buffer;
        }
        function program6(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n        ";
            stack1 = helpers.each.call(depth0, depth0 && depth0.select, {
                hash: {},
                inverse: self.noop,
                fn: self.program(7, program7, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n      ";
            return buffer;
        }
        function program7(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n          ";
            stack1 = helpers["if"].call(depth0, depth0 && depth0.selected, {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n        ";
            return buffer;
        }
        function program8(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\n            <div class="item" data-value="';
            if (helper = helpers.value) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.value;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '">';
            if (helper = helpers.text) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.text;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</div>\n          ";
            return buffer;
        }
        function program10(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n        ";
            stack1 = helpers.each.call(depth0, depth0 && depth0.select, {
                hash: {},
                inverse: self.noop,
                fn: self.programWithDepth(11, program11, data, depth0),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n      ";
            return buffer;
        }
        function program11(depth0, data, depth1) {
            var buffer = "", stack1;
            buffer += "\n          ";
            stack1 = helpers["if"].call(depth0, depth0 && depth0.selected, {
                hash: {},
                inverse: self.noop,
                fn: self.programWithDepth(12, program12, data, depth1),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n        ";
            return buffer;
        }
        function program12(depth0, data, depth2) {
            var buffer = "", stack1, helper;
            buffer += '\n            <span class="single-text" data-role="single-text">';
            if (helper = helpers.text) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.text;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</span>";
            stack1 = helpers["if"].call(depth0, depth2 && depth2.search, {
                hash: {},
                inverse: self.noop,
                fn: self.program(13, program13, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n          ";
            return buffer;
        }
        function program13(depth0, data) {
            return '<input type="text" data-role="placeholder" class="placeholder" autocomplete="off"/>';
        }
        function program15(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n      ";
            stack1 = helpers["if"].call(depth0, depth0 && depth0.search, {
                hash: {},
                inverse: self.program(18, program18, data),
                fn: self.program(16, program16, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n    ";
            return buffer;
        }
        function program16(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\n        <span class="single-text" data-role="single-text">';
            if (helper = helpers.label) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.label;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '</span><input type="text" data-role="placeholder" class="placeholder" autocomplete="off"/>\n      ';
            return buffer;
        }
        function program18(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += "\n        ";
            if (helper = helpers.label) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.label;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n      ";
            return buffer;
        }
        function program20(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n      ";
            stack1 = self.invokePartial(partials.multiItem, "multiItem", depth0, helpers, partials, data);
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n    ";
            return buffer;
        }
        function program22(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n      ";
            stack1 = helpers.each.call(depth0, depth0 && depth0.select, {
                hash: {},
                inverse: self.noop,
                fn: self.program(23, program23, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n    ";
            return buffer;
        }
        function program23(depth0, data) {
            var buffer = "", stack1;
            buffer += "\n        ";
            stack1 = self.invokePartial(partials.singleItem, "singleItem", depth0, helpers, partials, data);
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n      ";
            return buffer;
        }
        buffer += '<div class="input ';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.hasSelected, {
            hash: {},
            inverse: self.program(3, program3, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '" data-role="select">\n  <div class="selected-panel" data-role="selected" style="min-width:';
        if (helper = helpers.minWidth) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.minWidth;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        buffer += escapeExpression(stack1) + ";max-width:";
        if (helper = helpers.maxWidth) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.maxWidth;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        buffer += escapeExpression(stack1) + ";width:";
        if (helper = helpers.width) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.width;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        buffer += escapeExpression(stack1) + '">\n    ';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.hasSelected, {
            hash: {},
            inverse: self.program(15, program15, data),
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\n  </div>\n</div>\n<div class="dropdown" data-role="dropdown" style="display:none">\n  <div class="dropdown-content">\n    ';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.multiple, {
            hash: {},
            inverse: self.program(22, program22, data),
            fn: self.program(20, program20, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n  </div>\n</div>\n";
        return buffer;
    });
});

define("pandora/select/1.1.0/select-single-item-debug.handlebars", [ "gallery/handlebars/1.3.0/handlebars-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-debug");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, helper, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            return " selected";
        }
        function program3(depth0, data) {
            return " disabled";
        }
        buffer += '<div title="';
        if (helper = helpers.text) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.text;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        buffer += escapeExpression(stack1) + '" class="item';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.selected, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        stack1 = helpers["if"].call(depth0, depth0 && depth0.disabled, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '" data-index="';
        if (helper = helpers.index) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.index;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        buffer += escapeExpression(stack1) + '" data-role="item" data-value="';
        if (helper = helpers.value) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.value;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '">';
        if (helper = helpers.text) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.text;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "</div>\n";
        return buffer;
    });
});

define("pandora/select/1.1.0/select-multi-item-debug.handlebars", [ "gallery/handlebars/1.3.0/handlebars-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-debug");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, helper, options, functionType = "function", escapeExpression = this.escapeExpression, self = this, blockHelperMissing = helpers.blockHelperMissing;
        function program1(depth0, data, depth1) {
            var buffer = "", stack1, helper;
            buffer += '\n<label title="';
            if (helper = helpers.text) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.text;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" class="item';
            stack1 = helpers["if"].call(depth0, depth0 && depth0.selected, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            stack1 = helpers["if"].call(depth0, depth0 && depth0.disabled, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '" data-index="' + escapeExpression((stack1 = data == null || data === false ? data : data.index, 
            typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '" data-role="item" data-value="';
            if (helper = helpers.value) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.value;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '">\n  <input type="checkbox" data-text="';
            if (helper = helpers.text) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.text;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '" value="';
            if (helper = helpers.value) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.value;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '"';
            stack1 = helpers["if"].call(depth0, depth0 && depth0.selected, {
                hash: {},
                inverse: self.noop,
                fn: self.program(6, program6, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            stack1 = helpers["if"].call(depth0, depth0 && depth0.disabled, {
                hash: {},
                inverse: self.noop,
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '>\n  <span style="max-width: ' + escapeExpression((stack1 = depth1 && depth1.maxWidth, 
            typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '">';
            if (helper = helpers.text) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.text;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</span>\n</label>\n";
            return buffer;
        }
        function program2(depth0, data) {
            return " selected";
        }
        function program4(depth0, data) {
            return " disabled";
        }
        function program6(depth0, data) {
            return " checked";
        }
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.programWithDepth(1, program1, data, depth0),
            data: data
        };
        if (helper = helpers.select) {
            stack1 = helper.call(depth0, options);
        } else {
            helper = depth0 && depth0.select;
            stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper;
        }
        if (!helpers.select) {
            stack1 = blockHelperMissing.call(depth0, stack1, {
                hash: {},
                inverse: self.noop,
                fn: self.programWithDepth(1, program1, data, depth0),
                data: data
            });
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n";
        return buffer;
    });
});
