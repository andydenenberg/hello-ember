HelloEmber.StocksController = Em.ArrayController.extend({
  activeStockId: null,

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

  total_value: function() {
	var total = 0 ;
//	contacts.then(function(contacts){
			this.content.forEach(function(stock){
				total += stock.get('position_cost') ;			
			});
//	});	
	return total // Ember.inspect( this.count )
	}.property('content.@each.position_cost'),

  delete_stock: function(stock) {
    if (window.confirm("Are you sure you want to delete this stock?")) {
		stock.deleteRecord() ;
		this.store.commit();
	}
  }

});