HelloEmber.PortfoliosController = Ember.ArrayController.extend({

  delete_portfolio: function(portfolio) {
	portfolio.get('stocks').forEach(function(stock) {
		stock.deleteRecord() ;
	});
	portfolio.deleteRecord() ;
	this.store.commit();
  }
	
});