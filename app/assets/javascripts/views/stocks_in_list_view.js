HelloEmber.StockInListView = Em.View.extend({
  templateName: 'stock_in_list',
  tagName: 'li',
  classNameBindings: 'isActive:active',

  isActive: function() {
    return this.get('content.id') === this.get('controller.activeStockId');
  }.property('controller.activeStockId')
});