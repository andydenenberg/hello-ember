HelloEmber.StocksEditController = Em.ObjectController.extend({
  	needs: ["stocks"],
//	stocksBinding: "controllers.stocks",
  save: function() {	
	var portfolio_id = this.get('content').get('pid') ;
	var portfolio = HelloEmber.Portfolio.find(portfolio_id) ;

	var stock = this.get('content') ;	
	stock.set('portfolio', portfolio );
	portfolio.get('stocks').createRecord(stock.get('data.attributes'));
	
	var StocksController = this.get('controllers.stocks');    
	console.log('-');
	console.log('stocks:', StocksController.get('count'));
	console.log('-');
	
	stock.deleteRecord() ;
	
//	console.log('after', stock.toJSON())				
    this.store.commit();
  	return this.transitionToRoute('stocks' );
  }

});