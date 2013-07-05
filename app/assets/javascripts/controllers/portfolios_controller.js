HelloEmber.PortfoliosController = Ember.ArrayController.extend({
	activePortfolioId: null,
	content: null,
	
	sortProperties: ['portfolio_value'],
    sortAscending: true,

  count: function() {
	return this.content.length > 0 
  }.property(),

  display_list: function() {
	// hide portfolio listing if one is selected of if list is blank
	return (this.activePortfolioId === null) && (this.content.get('length') > 0) 	
  }.property('activePortfolioId','content.@each'),

  sort: function() {
	direction = this.get('sortAscending') ;
	if (direction == true) { this.set('sortAscending', false) ;	}
	else { this.set('sortAscending', true) ; };    
  },

  total_stocks: function() {
	var total = 0 ;
//	contacts.then(function(contacts){
		console.log('in total calc')
			this.content.forEach(function(portfolio){
				total += portfolio.get('portfolio_value') ;			
			});
//	});	
	return total // Ember.inspect( this.count )
	}.property('content.@each.portfolio_value'),

  total_daily: function() {
	var total = 0 ;
			this.content.forEach(function(portfolio){
				total += portfolio.get('portfolio_daily') ;			
			});
	return total
	}.property('content.@each.portfolio_daily'),
  
  total_cash: function() {
	var total = 0 ;
			this.content.forEach(function(portfolio){
				total += portfolio.get('cash') ;			
			});
	return total
	}.property('content.@each.cash'),

  delete_portfolio: function(portfolio) {
    if (window.confirm("Are you sure you want to delete this portfolio and its stocks?")) {
		portfolio.get('stocks').forEach(function(stock) {
			stock.deleteRecord() ;
		});
		portfolio.deleteRecord() ;
		this.store.commit();
	}
  }
	
});