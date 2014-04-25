# 初始化

- order: 1

----

<script>
seajs.use('select.css');
</script>

## 可以根据原生的 select 初始化

trigger 为 select，并默认选中 option2

````html
<select id="example1">
    <option value="option1">option1</option>
    <option value="option2" selected="selected">option2</option>
    <option value="option3">option3</option>
</select>
````

````javascript
seajs.use(['select'], function(Select) {
    new Select({
        trigger: '#example1'
    });
});
````

## 可直接传入 DOM 初始化

trigger 为任意 DOM，但必须传入 model 数据

````html
<a href="#" id="example2" class="ue-select-trigger">请选择</a>
````

````javascript
seajs.use(['select'], function(Select) {
    new Select({
        trigger: '#example2',
        multiple: true,
        name: 'template',
        model: [
            {value:'0', text:'蓝色模板'},
            {value:'1', text:'红色模板', selected: true},
            {value:'2', text:'绿色模板'}
        ]
    });
});
````

