HelloEmber.PortfoliosNewController = Ember.ObjectController.extend({
  needs: ['Portfolios'],

  createNew: function() {
    this.transaction = this.get('store').transaction();
    var new_one = this.transaction.createRecord(HelloEmber.Portfolio, { 'cash' : 100000 } );
	this.set('content', new_one) ;
  },

  RecordHasID: function() {
//	this.transitionToRoute('portfolios');    
//	this.transitionToRoute('portfolio', this.content);    
// this.get('content').reload();
	},

  save: function() {
	console.log('content', this.content.toJSON() ) ;
    this.transaction.commit();
	flash_message('Portfolio was successfully created.', 'success') ;
	this.transaction = null;
//	this.content.addObserver('id', this, 'RecordHasID');
//this.transitionToRoute('system');    
this.transitionToRoute('portfolios.position', this.content);    
    
  },

  cancel: function() {
    // rollback the local transaction if it hasn't already been cleared
    if (this.transaction) {
      this.transaction.rollback();
      this.transaction = null;
    }
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