HelloEmber.PortfoliosController = Ember.ArrayController.extend({
	needs: ['Graph'],

	activePortfolioId: null,
	content: null,
	
	sortProperties: ['portfolio_daily'],
    sortAscending: false,
	col_Total: 'portfolio_value',
	col_Daily: 'portfolio_daily',
	col_Name: 'name',
	by_name: 'name',
  	by_value: 'portfolio_value',
  	by_daily: 'portfolio_daily',
  	
	dates: ["Current Week", "Current Month", "Current Quarter", "Current Year"],
	date_range: 'Current Week',
	
	port_range: function() {
		var names = [ 'All' ] ;
				this.content.forEach(function(portfolio){				
					names.push( portfolio.get('name') );			
				});
		var GraphController = this.get('controllers.Graph');		
		GraphController.set('portfolio_names', names) ;
//		debugger;
		return names		
	}.property('content.length'), 
		
	portfolio_select: null,
	
	refresh_graph: function() {
		this.load_graph() ;
	}.observes('date_range','portfolio_select'),
	
  count: function() {
	return this.content.length > 0 
  }.property('content'),

  display_list: function() {
	// hide portfolio listing if one is selected of if list is blank
	return (this.activePortfolioId == null) && (this.content.get('length') > 0) 	
  }.property('activePortfolioId','content.@each'),

  sort: function(criteria) {
	this.set('sortProperties', [criteria]);
	
	direction = this.get('sortAscending') ;
	if (direction == true) { this.set('sortAscending', false) ;	}
	else { this.set('sortAscending', true) ; };    
  },

	total_options_cost: function() {
		return this.content.reduce(function(accum, portfolio) { 
	                      return accum + portfolio.get('options_cost') }, 0)
						}.property('content.@each.options_cost').cacheable(),
	
	total_stocks_cost: function() {
		return this.content.reduce(function(accum, portfolio) { 
	                      return accum + portfolio.get('stocks_cost') }, 0)
						}.property('content.@each.stocks_cost').cacheable(),
	
	total_stocks_only: function() {
		return this.content.reduce(function(accum, portfolio) { 
	                      return accum + portfolio.get('stocks_value') }, 0)
					}.property('content.@each.stocks_value').cacheable(),
	
  	total_dividends: function() {
		return this.content.reduce(function(accum, portfolio) { 
	                      return accum + portfolio.get('daily_dividends') }, 0)
					}.property('content.@each.daily_dividends').cacheable(),

  	total_options_only: function() {
		return this.content.reduce(function(accum, portfolio) { 
	                      return accum + portfolio.get('options_value') }, 0)
					}.property('content.@each.options_value').cacheable(),
	
  	total_value: function() {
		return this.content.reduce(function(accum, portfolio) { 
	                      return accum + portfolio.get('portfolio_value') }, 0)
					}.property('content.@each.portfolio_value').cacheable(),

	total_daily: function() {
		return this.content.reduce(function(accum, portfolio) { 
                      return accum + portfolio.get('portfolio_daily') }, 0)
					}.property('content.@each.portfolio_daily').cacheable(),
  
	total_cash: function() {
		return this.content.reduce(function(accum, portfolio) { 
                      return accum + portfolio.get('cash') }, 0)
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
//	    GraphController.set('graph_id', 'theegraph');
//		GraphController.set('x_min','Jul 01, 2013') ;
//		GraphController.set('x_max','Sep 01, 2013') ;
	    GraphController.load_data( this.get('portfolio_select'), this.get('date_range') );
	}	
	
});