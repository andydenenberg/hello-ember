HelloEmber.PortfoliosNewController = Ember.ObjectController.extend({

  createNew: function() {
    this.transaction = this.get('store').transaction();
    var new_one = this.transaction.createRecord(HelloEmber.Portfolio, {} );
	this.set('content', new_one) ;

//    this.transaction = this.get('store').transaction();
//    this.set('content', this.transaction.createRecord(HelloEmber.Portfolio, {} ));

  },

  save: function() {
    this.transaction.commit();
    this.transaction = null;
	this.transitionToRoute('portfolios');
    
  },

  delete_portfolio: function(portfolio) {

	portfolio.get('stocks').forEach(function(stock) {
		alert(stock) ;
		stock.deleteRecord() ;
	});

	portfolio.deleteRecord() ;
	this.store.commit();
  }
	
});