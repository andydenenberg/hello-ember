HelloEmber.StocksEditController = Em.ObjectController.extend({	
//  needs: 'portfolios',
  all_ports: null,

  cancel: function() {
    // rollback the local transaction if it hasn't already been cleared
    if (this.transaction) {
      this.transaction.rollback();
      this.transaction = null;
    }
	this.transitionToRoute('stock', this.content);
  },
  
  save: function() {	
	var portfolio = this.get('portfolio') ;
	var stock = this.get('content') ;	
	stock.set('portfolio', portfolio );
	portfolio.get('stocks').createRecord(stock.get('data.attributes'));
	
	stock.deleteRecord() ;
    this.store.commit();
	flash_message('Stock record was successfully update.', 'success') ;	
  	return this.transitionToRoute('stocks' );
  }

});