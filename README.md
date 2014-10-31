# Select

---
[![Build Status](https://secure.travis-ci.org/pandorajs/select.png)](https://travis-ci.org/pandorajs/select)

[![Coverage Status](https://coveralls.io/repos/lynzz/select/badge.png)](https://coveralls.io/r/lynzz/select)

模拟 select 的组件. 目前只兼容 chrome,适用于后台开发场景

---

## 使用方法

Select 继承 [Widget](https://github.com/pandorajs/widget)

### field 为 select

html 片段

```html
<select id="template" name="template">
  <option value="0">蓝色模板</option>
  <option value="1">红色模板</option>
</select>
```

javascirpt 片段

```javascript
new Select({
  field:'#tempalte'
})
```
### field 为其他 DOM

html 片段

```html
<a href="#" id="template"></a>
```

javascript 片段

```js
new Select({
    field: '#template',
    name: 'template',
    model: [
        {value:'0', text: '蓝色模板'},
        {value:'1', text: '红色模板'}
    ]
});
```
## 配置说明

### field *string*

field 可以为 select 或 其他任何 DOM。

**注意：**field只能为一个 DOM，如果选出来多个会取第一个

* 如果为 select，会将其隐藏。
* 如果为 DOM，实例化的时候则需要提供 model 作为数据源


### model *object*

model 的来源有两处

1. 初始化传入
2. 如果 field 为 select，则会根据结构生成 model

model 的格式为

```javascript
[
    {value:'value1', text: 'text1', selected: true},
    {value:'value2', text: 'text2'}
]
```

`value` `text` 均为 option 的属性


### classPrefix *string*_

样式前缀，默认为 `ue-select`

### name *string*

模拟 select 的属性，表单项需要的 name 值，等同于 `select.name`

**注意**：如果 field 不是 select，那么会先在页面找 name 的 input，找不到再创建一个。

### value *string*

模拟 select 的属性，获取被选中 option 的 value 值，等同于 `select.value`, 多选时用“,”隔开

### multiple *boolean*

多选框，采用 checkbox 进行多选，field 为 select设置为multiple无效，必须在这设置

### hasOptionAll *boolean*

是否有”全部“选项，默认为 false

### hasLebel *boolean*

是否要显示 label，即 select 框说明，只适用于原生 select 

### search *boolean*

是否开启搜索

### sifterOptions *object*

搜索配置, 开启 search，才生效

* fields 要搜索的字段集合
* placeholder 搜索框 placeholder
* emptyTemplate 搜索结果为空时，显示的文本
* limit 搜索条数

## 方法

### .select(option)

//TODO

## 事件

### change

//TODO

## 问题讨论

