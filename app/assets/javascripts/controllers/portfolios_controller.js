HelloEmber.PortfoliosController = Ember.ArrayController.extend({
	needs: ['Graph'],

	activePortfolioId: null,
	content: null,
	
	sortProperties: ['portfolio_daily'],
    sortAscending: false,
	col_Total: 'portfolio_value',
	col_Daily: 'portfolio_daily',
	col_Name: 'name',

//  count: function() {
//	return this.content.length > 0 
//  }.property(),

  display_list: function() {
	// hide portfolio listing if one is selected of if list is blank
	return (this.activePortfolioId == null) && (this.content.get('length') > 0) 	
  }.property('activePortfolioId','content.@each'),

  sort_by_name: function() {
	this.set('sortProperties', ['name']);
	
	direction = this.get('sortAscending') ;
	if (direction == true) { this.set('sortAscending', false) ;	}
	else { this.set('sortAscending', true) ; };    
  },

  sort_by_value: function() {
	this.set('sortProperties', ['portfolio_value']);
	
	direction = this.get('sortAscending') ;
	if (direction == true) { this.set('sortAscending', false) ;	}
	else { this.set('sortAscending', true) ; };    
  },

  sort_by_daily_change: function() {
	this.set('sortProperties', ['portfolio_daily']);
	
	direction = this.get('sortAscending') ;
	if (direction == true) { this.set('sortAscending', false) ;	}
	else { this.set('sortAscending', true) ; };    
  },

  	total_stocks_only: function() {
	var total = 0 ;
			this.content.forEach(function(portfolio){				
				total += portfolio.get('stocks_value') ;			
			});
	return total // Ember.inspect( this.count )
	}.property('content.@each.stocks_value').cacheable(),

  	total_dividends: function() {
	var total = 0 ;
			this.content.forEach(function(portfolio){				
				total += portfolio.get('daily_dividends') ;			
			});
	return total // Ember.inspect( this.count )
	}.property('content.@each.daily_dividends').cacheable(),

  	total_options_only: function() {
	var total = 0 ;
			this.content.forEach(function(portfolio){				
				total += portfolio.get('options_value') ;			
			});
	return total // Ember.inspect( this.count )
	}.property('content.@each.options_value').cacheable(),

	
  total_stocks: function() {
	var total = 0 ;
//	contacts.then(function(contacts){
		console.log('in total calc')
			this.content.forEach(function(portfolio){
				total += portfolio.get('portfolio_value') ;			
			});
//	});	
	return total // Ember.inspect( this.count )
	}.property('content.@each.portfolio_value').cacheable(),

  total_daily: function() {
	var total = 0 ;
			this.content.forEach(function(portfolio){
				total += portfolio.get('portfolio_daily') ;			
			});
	return total
	}.property('content.@each.portfolio_daily').cacheable(),
  
  total_cash: function() {
	var total = 0 ;
			this.content.forEach(function(portfolio){
				total += portfolio.get('cash') ;			
			});
	return total
	}.property('content.@each.cash').cacheable(),
	
		
	  delete_portfolio: function(portfolio) {
	    if (window.confirm("Are you sure you want to delete this portfolio and its stocks?")) {
			portfolio.get('stocks').forEach(function(stock) {
				stock.deleteRecord() ;
			});
			portfolio.deleteRecord() ;
			this.store.commit();
		}
	  },


	load_graph: function(){
		var GraphController = this.get('controllers.Graph');
	    GraphController.set('graph', 'theegraph');
	    GraphController.load();
	}
	
});