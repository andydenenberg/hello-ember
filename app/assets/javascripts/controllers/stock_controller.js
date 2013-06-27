HelloEmber.StockController = Ember.ObjectController.extend({
	cancel: function() {
	this.transitionToRoute('stocks');
  }
})