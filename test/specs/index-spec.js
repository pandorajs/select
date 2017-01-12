/* global describe: true*/
/* global it: true*/
/* global beforeEach: true*/
/* global afterEach: true*/
var Select = require('../../src/select');

var $ = require('jquery');

describe('Select', function() {
  var input, select, nativeSelect;

  beforeEach(function() {
    input = $('<input id="test" type="text" value="" />').appendTo(document.body);
    nativeSelect = $('<select id="test1"></select>').appendTo(document.body);
    nativeSelect.append('<option value="0">text1</option>');
    nativeSelect.append('<option value="1">text2</option>');
    nativeSelect.append('<option value="2">text3</option>');
  });
  afterEach(function() {
    input.remove();
    nativeSelect.remove();
    if (select) {
      select.destroy();
      select = null;
    }
  });

  it('normal usage', function() {
    select = new Select({
      field: '#test',
      model: [{
        text: 'text1',
        value: 'val1'
      }]
    });

    expect(select).to.be.ok();
    select.role('select').trigger('click');
    expect(select.role('item').length).to.be(1);
  });

  it('native select init1', function() {
    nativeSelect.attr('value', '2');
    select = new Select({
      field: '#test1'
    });
    expect(select.field.val()).to.be('2');
  });

  it('native select init2', function() {
    select = new Select({
      field: '#test1'
    });
    expect(select.field.val()).to.be('0');
  });

  it('native select init3', function() {
    select = new Select({
      hasLabel: true,
      field: '#test1'
    });

    expect(select.role('selected').text().indexOf('请选择') > -1).to.be(true);
    expect(select.field.val()).to.be(null);
  });

  it('native select init4', function() {
    nativeSelect.attr('value', '2');
    select = new Select({
      hasLabel: true,
      field: '#test1'
    });
    expect(select.field.val()).to.be('2');
  });

  it('multiple async select', function() {
    input.val('13');
    select = new Select({
      field: '#test',
      multiple: true,
      load: function(callback) {
        callback([{
          text: 'text1',
          value: '1'
        }, {
          text: 'text1',
          value: '2'
        }, {
          text: 'text1',
          value: '13'
        }]);
      }

    });
    expect(select.role('selected').children().length).to.be(1);
  });


  describe('Method', function() {
    it('keyBack', function() {
      select = new Select({
        field: '#test',
        search: true,
        load: function(callback) {
          callback([{
            value: '0',
            text: 'blue template'
          }, {
            value: '1',
            text: 'red template'
          }, {
            value: '2',
            text: 'green template'
          }]);
        }
      });

      select.role('select').trigger('click');
      select.keyBack();

      expect(select.role('item').length).to.be(3);
      expect(select.role('single-text').is(':visible')).to.be(false);
      expect(select.value).to.be(null);
    });

    it('clearValue', function() {
      select = new Select({
        field: '#test',
        search: true,
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      select.role('select').trigger('click');
      select.role('item').eq(1).trigger('click');

      select.clearValue();
      expect(select.data('select')[0].selected).to.be(false);
      expect(select.value).to.be(null);
      expect(select.text).to.be(null);
      expect(select.searchInput.val()).to.be('');
      expect(select.field.val()).to.be('');
    });

    it('showDropdown and hideDropdown', function() {
      select = new Select({
        field: '#test',
        search: true,
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      select.showDropdown();
      expect(select.role('dropdown').is(':visible')).to.be(true);
      expect(select.showSelect).to.be(true);

      select.hideDropdown();
      expect(select.role('dropdown').is(':visible')).to.be(false);
      expect(select.showSelect).to.be(false);
    });

    it('setValue and search is false', function() {
      select = new Select({
        field: '#test',
        hasOptionAll: true,
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      select.setValue('');
      expect(select.field.val()).to.be('');
      expect(select.value).to.be(null);

      select.setValue('1');
      expect(select.field.val()).to.be('1');

      select.setValue('2');
      expect(select.field.val()).to.be('2');
    });

    it('initAttrs and multiple is true', function() {
      input.val('1,2');
      select = new Select({
        field: '#test',
        multiple: true,
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      expect(select.role('selected').children().length).to.be(2);
    });


    it('setValue and search is true', function() {
      select = new Select({
        field: '#test',
        //hasOptionAll: true,
        search: true,
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      select.setValue('');
      expect(select.field.val()).to.be('');
      expect(select.value).to.be(null);

      select.setValue('1');
      expect(select.field.val()).to.be('1');

      select.setValue('2');
      expect(select.field.val()).to.be('2');
    });

  });

  describe('Options', function() {
    it('search is true', function() {
      select = new Select({
        field: '#test',
        search: true,
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      expect(select.role('placeholder').length).to.be(1);
    });

    it('search is false', function() {
      select = new Select({
        field: '#test',
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      expect(select.role('placeholder').length).to.be(0);
    });

    it('placeholder', function() {
      select = new Select({
        field: '#test',
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });
      expect(select.option('placeholder')).to.be('请选择');
      expect(select.role('single-text').text()).to.be('请选择');
      expect(select.value).to.be(null);
      expect(select.field.val()).to.be('');
    });

    it('placeholder and async load model', function() {
      select = new Select({
        field: '#test',
        load: function(callback) {
          //setTimeout(function() {
          callback([{
            value: '0',
            text: 'blue template'
          }, {
            value: '1',
            text: 'red template'
          }, {
            value: '2',
            text: 'green template'
          }]);
          //}, 0);
        }
      });
      expect(select.option('placeholder')).to.be('请选择');
      expect(select.role('item').length).to.be(3);
      expect(select.role('single-text').text()).to.be('请选择');
      expect(select.value).to.not.ok();
      expect(select.field.val()).to.be('');
    });

    it('minWidth, and less than maxWidth', function() {
      select = new Select({
        field: '#test',
        minWidth: 50,
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      expect(select.role('selected').css('min-width')).to.be('50px');
    });

    it('async load', function() {
      select = new Select({
        field: '#test',
        load: function(callback) {
          callback([{
            value: '0',
            text: 'blue template'
          }, {
            value: '1',
            text: 'red template'
          }, {
            value: '2',
            text: 'green template'
          }]);
        }
      });

      expect(select.role('item').length).to.be(3);
    });

    it('hasOptionAll is true', function() {
      select = new Select({
        field: '#test',
        hasOptionAll: true,
        load: function(callback) {
          callback([{
            value: '0',
            text: 'blue template'
          }, {
            value: '1',
            text: 'red template'
          }, {
            value: '2',
            text: 'green template'
          }]);
        }
      });

      expect(select.role('item').eq(0).text()).to.be(select.option('defaultText'));
      expect(select.role('item').length).to.be(4);
      expect(select.role('item').first().text()).to.be(select.option('defaultText'));
    });

    it('toggle click select', function() {
      select = new Select({
        field: '#test',
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      select.role('select').trigger('click');
      expect(select.role('dropdown').is(':visible')).to.be(true);

      select.role('select').trigger('click');
      expect(select.role('dropdown').is(':visible')).to.be(false);
    });

    it('select single value', function() {
      select = new Select({
        field: '#test',
        search: true,
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      select.showDropdown();
      select.setValue('2')
      expect(select.field.val()).to.be('2');

    });

    it('select multiple value', function() {
      select = new Select({
        field: '#test',
        multiple: true,
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      var item0 = select.role('item').eq(0);

      select.role('select').trigger('click');

      item0.trigger('click');
      expect(select.role('selected').children().length).to.be(1);

    });

  });

  describe('search with sifter', function() {
    it('show search input', function() {
      select = new Select({
        field: '#test',
        search: true,
        model: [{
          text: 'Stone',
          value: '1'
        }, {
          text: 'china',
          value: '2'
        }]
      });

      select.role('select').trigger('click');
      select.showPlaceholder();

      expect(select.role('placeholder').val()).to.be('');

    });

    it('search empty', function() {
      select = new Select({
        field: '#test',
        search: true,
        model: [{
          value: '0',
          text: 'blue template'
        }, {
          value: '1',
          text: 'red template'
        }, {
          value: '2',
          text: 'green template'
        }]
      });

      select.role('select').trigger('click');
      select.keyBack();
      select.searchInput.val('abc');
      select.search();

      expect(select.role('empty').length).to.be(1);
      expect(select.role('empty').text()).to.eql(select.option('sifterOptions/emptyTemplate'));
    });


    it('async load and open search', function() {
      select = new Select({
        field: '#test',
        search: true,
        load: function(callback) {
          callback([{
            value: '0',
            text: 'blue template'
          }, {
            value: '1',
            text: 'red template'
          }, {
            value: '2',
            text: 'green template'
          }]);
        }
      });

      select.keyBack();

      select.searchInput.val('red');
      select.search();
      expect(select.role('item').length).to.be(1);
      expect(select.role('item').eq(0).data('value')).to.be(1);


    });

    it('select item with search', function() {
      select = new Select({
        field: '#test',
        search: true,
        load: function(callback) {
          callback([{
            value: '0',
            text: 'blue template'
          }, {
            value: '1',
            text: 'red template'
          }, {
            value: '2',
            text: 'green template'
          }]);
        }
      });

      select.keyBack();
      select.searchInput.val('red');
      select.search();

      select.setValue('1');
      expect(select.field.val()).to.be('1');
    });

  });

});
