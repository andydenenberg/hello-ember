HelloEmber.PortfoliosController = Ember.ArrayController.extend({
  count: function() {
	return this.content.length > 0 
  }.property(),
  
  delete_portfolio: function(portfolio) {
	portfolio.get('stocks').forEach(function(stock) {
		stock.deleteRecord() ;
	});
	portfolio.deleteRecord() ;
	this.store.commit();
  }
	
});