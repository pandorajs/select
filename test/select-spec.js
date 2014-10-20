/* global describe: true*/
/* global it: true*/
/* global beforeEach: true*/
/* global afterEach: true*/
define(function(require, exports, module) {
  var Select = require('select');
  var expect = require('expect');
  var $ = require('$');

  describe('Select', function() {
    var input, select;

    beforeEach(function () {
      input = $('<input id="test" type="text" value="" />').appendTo(document.body);
    });
    afterEach(function () {
      input.remove();
      if (select) {
        select.destroy();
        select = null;
      }
    });

    it('normal usage', function () {
      select = new Select({
        field: '#test',
        model: [
          {
            text: 'text1',
            value: 'val1'
          }
        ]
      });

      expect(select).to.be.ok();
      select.role('select').trigger('click');
      expect(select.role('item').length).to.be(1);
    });

    describe('Options', function() {
      it('search is true', function () {
        select = new Select({
          field: '#test',
          search: true,
          model: [
            {value:'0', text:'blue template'},
            {value:'1', text:'red template'},
            {value:'2', text:'green template'}
          ]
        });

        expect(select.role('placeholder').length).to.be(1);
      });

      it('search is false', function () {
        select = new Select({
          field: '#test',
          model: [
            {value:'0', text:'blue template'},
            {value:'1', text:'red template'},
            {value:'2', text:'green template'}
          ]
        });

        expect(select.role('placeholder').length).to.be(0);
      });

      it('async load', function () {
        select = new Select({
          field: '#test',
          load: function(callback) {
            callback([
              {value:'0', text:'blue template'},
              {value:'1', text:'red template'},
              {value:'2', text:'green template'}
            ]);
          }
        });

        expect(select.role('item').length).to.be(3);
      });

      it('toggle click select', function () {
        select = new Select({
          field: '#test',
          model: [
            {value:'0', text:'blue template'},
            {value:'1', text:'red template'},
            {value:'2', text:'green template'}
          ]
        });

        select.role('select').trigger('click');
        expect(select.role('dropdown').is(':visible')).to.be(true);

        select.role('select').trigger('click');
        expect(select.role('dropdown').is(':visible')).to.be(false);
      });

      it('single select value', function () {
        select = new Select({
          field: '#test',
          search: true,
          model: [
            {value:'0', text:'blue template'},
            {value:'1', text:'red template'},
            {value:'2', text:'green template'}
          ]
        });

        select.role('select').trigger('click');
        select.role('item').eq(1).trigger('click');

        expect(select.role('dropdown').is(':visible')).to.be(false);
        expect(select.field.val()).to.be('1');
      });

      it('multiple select value', function () {
        select = new Select({
          field: '#test',
          multiple: true,
          model: [
            {value:'0', text:'blue template'},
            {value:'1', text:'red template'},
            {value:'2', text:'green template'}
          ]
        });

        var item0 = select.role('item').eq(0);
        var item1 = select.role('item').eq(1);

        select.role('select').trigger('click');

        item0.trigger('click');
        //item1.trigger('click');
        expect(item0.hasClass('selected')).to.be(true);
        //console.log(select.role('selected').html());
        //expect(item1.hasClass('selected')).to.be(true);
        //expect(select.role('selected').find('[data-value=0]').length).to.be(1);
      });

    });

    describe('search with sifter', function() {
      it('show search input', function () {
        select = new Select({
          field: '#test',
          search: true,
          model: [
            {
              text: 'Stone',
              value: '1'
            }, {
              text: 'china',
              value: '2'
            }
          ]
        });

        select.role('select').trigger('click');
        select.showPlaceholder();

        expect(select.role('placeholder').val()).to.be('');

      });

      it('search empty', function () {
        select = new Select({
          field: '#test',
          search: true,
          model: [
            {value:'0', text:'blue template'},
            {value:'1', text:'red template'},
            {value:'2', text:'green template'}
          ]
        });

        select.role('select').trigger('click');
        select.keyBack();
        select.searchInput.val('abc');
        select.search();

        expect(select.role('empty').length).to.be(1);
        expect(select.role('empty').text()).to.eql(select.option('sifterOptions/emptyTemplate'));
      });

      it('clear value', function () {
        select = new Select({
          field: '#test',
          search: true,
          model: [
            {value:'0', text:'blue template'},
            {value:'1', text:'red template'},
            {value:'2', text:'green template'}
          ]
        });

        select.role('select').trigger('click');
        select.role('item').eq(1).trigger('click');

        select.clearValue();
        expect(select.data('select')[0].selected).to.be(false);
        expect(select.field.val()).to.be('');
        expect(select.searchInput.val()).to.be('');
      });

    });

  });
});
