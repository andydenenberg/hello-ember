HelloEmber.StocksController = Em.ArrayController.extend({
  	
  with_ids: function(){        
    return this.content.filter(function(stock) {
	  return stock.get('id') != null;
	});
  }.property("content.@each.stock").cacheable(),

  add_stock: function() {
	// method for testing - not used in program 
	var portfolio = HelloEmber.Portfolio.find(1) ;	
    this.transaction = this.get('store').transaction();
    this.transaction.createRecord(HelloEmber.Stock, {symbol: 'CSCO', quantity: 100, purchase_price: 12.67, portfolio: portfolio } );
    this.transaction.commit();
    this.transaction = null;	
  },

  delete_stock: function(stock) {
	stock.deleteRecord() ;
	this.store.commit();
  }

});