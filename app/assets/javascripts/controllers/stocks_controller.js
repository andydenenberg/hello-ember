HelloEmber.StocksController = Em.ArrayController.extend({
  	
  with_ids: function(){        
  return this.content.filter(function(stock) {
//	alert(stock) ;
	  return stock.get('id') != null;
	});
	}.property("content.@each.stock").cacheable(),

  count: function() {	
  	return this.get('with_ids').get('length') ;
  }.property('content.@each.stock'),


  add_stock: function() {
	var portfolio = HelloEmber.Portfolio.find(1) ;
	
    this.transaction = this.get('store').transaction();
    this.transaction.createRecord(HelloEmber.Stock, {symbol: 'CSCO', quantity: 100, purchase_price: 12.67, portfolio: portfolio } );

    this.transaction.commit();
    this.transaction = null;

//	record = this.get('store').createRecord(HelloEmber.Stock, {symbol: 'CSCO', quantity: 100, purchase_price: 12.67 })
//	this.store.commit();
	
  },

  delete_stock: function(stock) {
	stock.deleteRecord() ;
	this.store.commit();
  }

});