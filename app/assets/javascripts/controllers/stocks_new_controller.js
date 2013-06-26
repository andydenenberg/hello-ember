HelloEmber.StocksNewController = Ember.ObjectController.extend({
  needs: 'portfolios',
  all_ports: null,
  current_user_portfolio: null,
	
  createNew: function() {
// create a new record on a local transaction
    this.transaction = this.get('store').transaction();
	this.set('content', this.transaction.createRecord(HelloEmber.Stock, {} ) ) ;

	var portfolio = HelloEmber.Portfolio.find().filterProperty('name', "roberta").get('firstObject') ;
	this.set('current_user_portfolio', portfolio );
  },

  save: function() {
	var portfolio = this.get('current_user_portfolio') ;
	this.get('content').set('portfolio', portfolio) ;
    this.transaction.commit();
    this.transaction = null;
	this.transitionToRoute('stocks');
  },

  cancel: function() {
    // rollback the local transaction if it hasn't already been cleared
    if (this.transaction) {
      this.transaction.rollback();
      this.transaction = null;
    }
	this.transitionToRoute('stocks');
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