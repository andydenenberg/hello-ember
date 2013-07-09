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
//	console.log('data attributes', stock.get('data.attributes')) ;
	portfolio.get('stocks').createRecord({ 'symbol': stock.get('symbol'), 'quantity': stock.get('quantity'), 'purchase_price': stock.get('purchase_price'), 'purchase_date': stock.get('purchase_date') });
	
	stock.deleteRecord() ;
    this.store.commit();
	flash_message('Stock record was successfully update.', 'success') ;	
  	return this.transitionToRoute('stocks' );
  }

});