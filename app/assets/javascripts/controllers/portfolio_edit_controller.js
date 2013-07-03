HelloEmber.PortfolioEditController = Em.ObjectController.extend({
  needs: ['portfolio'],

  startEditing: function() {
    var portfolio = this.get('content');
    var transaction = portfolio.get('store').transaction();
    transaction.add(portfolio);

    portfolio.get('stocks').forEach(function(stock) {
      transaction.add(stock);
    });
    this.transaction = transaction;

	console.log('startEditing') ;

  },

  stopEditing: function() {
    // rollback the local transaction if it hasn't already been cleared
    var transaction = this.transaction;
    if (transaction) {
      transaction.rollback();
      this.transaction = undefined;
    }

	console.log('stopEditing') ;

  },

  save: function() {
	stocks = this.get('content').get('stocks') ;
	stocks.forEach (function(stock) {
		stock.set('symbol', stock.get('symbol').toUpperCase() ) ;
	});
		
    this.transaction.commit();
    this.transaction = undefined;
    this.get('controllers.portfolio').stopEditing();

	flash_message('Portfolio was successfully updated.', 'success') ;			
  	return this.transitionToRoute('portfolio', this.get('content') );
  },

  cancel: function() {
    this.get('controllers.portfolio').stopEditing();
  },

  addStock: function() {
    this.get('content.stocks').createRecord();
  },

  removeStock: function(stock) {
	console.log(stock) ;
    stock.deleteRecord();
  }

});
