# 初始化

- order: 1

----

<script>
seajs.use('select.css');
</script>

## 可根据原生的 select 初始化

trigger 为 select，并默认选中 option2

````html
<select id="example1">
    <option value="0">蓝色</option>
    <option value="1">红色</option>
    <option value="2">绿色</option>
</select>
````

````javascript
seajs.use(['select'], function(Select) {
    new Select({
        trigger: '#example1',
        value: '1'
    });
});
````


## 可直接传入 DOM 初始化

trigger 为任意 DOM，但必须传入 model 数据

````html
<a href="#" id="example2">请选择</a>
````

````javascript
seajs.use(['select'], function(Select) {
    new Select({
        trigger: '#example2',
        //multiple: true,
        name: 'template',
        model: [
            {value:'0', text:'蓝色模板'},
            {value:'1', text:'红色模板'},
            {value:'2', text:'绿色模板'}
        ]
    });
});
````

## 可根据原生的 input 初始化

trigger 为 input, 默认值为 1,如有设置value值，能过js配置的优先级高， 同上必须传入 model 数据

````html
<input value="1" id="example3" name="theme">
````

````javascript
seajs.use(['select'], function(Select) {
    new Select({
        trigger: '#example3',
        //value: '2',
        model: [
            {value:'0', text:'蓝色模板'},
            {value:'1', text:'红色模板'},
            {value:'2', text:'绿色模板'}
        ]
    });
});
````

## 可根据原生的 input 初始化多选框

trigger 为 input, 如有设置value值，能过js配置的优先级高， 同上必须传入 model 数据

> **注：多选只支持在js配置mulitple**

````html
<input value="" id="example4" name="theme">
````

````javascript
seajs.use(['select'], function(Select) {
    new Select({
        trigger: '#example4',
        //value: '2',
        multiple: true,
        model: [
            {value:'0', text:'蓝色模板'},
            {value:'1', text:'红色模板'},
            {value:'2', text:'绿色模板'}
        ]
    });
});
````

