
  /**
   * 处理子组件（widget 的子类）
   *
   * @module Widget
   */

  'use strict';

  module.exports = function(parentWidget, children) {
    var roleContent,
      i,
      n,
      child,
      uniqueId = parentWidget.uniqueId;

    function createDummy() {
      var div = parentWidget.document.createElement('div');
      roleContent[0].appendChild(div);
      return div;
    }

    function replaceDummy() {
      /*jshint validthis:true */
      var dummy = this['dummy' + uniqueId];
      dummy.parentNode.replaceChild(this.element[0], dummy);
    }

    function eventBubbling(e) {
      return parentWidget.fire.apply(parentWidget, arguments);
    }

    if (children) {

      // 绑定销毁事件
      parentWidget.on('destroy', function(e) {
        var n;
        // 仅当 destroy 事件来自父时
        if (e.target === this) {
          n = children.length;
          while (n--) {
            children[n].destroy();
          }
        }
      });

      roleContent = parentWidget.role(parentWidget.option('contentRole'));

      if (roleContent.length === 0) {
        roleContent = parentWidget.element;
      }

      for (i = 0, n = children.length; i < n; i++) {
        child = children[i];

        // 自动冒泡事件
        child.on('all', eventBubbling);

        // 子组件已加载，直接插入
        if (child.rendered) {
          roleContent.append(child.element);
        } else {
          // 异步加载子 widget，添加占位符，保证顺序
          child['dummy' + uniqueId] = createDummy();

          child.once('render', replaceDummy);
        }
        child.parentWidget = parentWidget;
      }
    }
  };
