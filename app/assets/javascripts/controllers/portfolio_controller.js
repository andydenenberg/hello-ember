HelloEmber.PortfolioController = Em.ObjectController.extend({
	isEditing: false,
	needs: ['PortfolioEdit'],

	sortProperties: ['position_value'],
	sortAscending: false,

	  by_symbol: 'symbol',
	  by_value: 'position_value',
	  by_daily: 'position_daily',

	col_Value: 'position_value',
	col_Daily: 'position_daily',
	col_symbol: 'symbol',
	
  // use an array proxy with sortable mixin in order to sort by related data ( stocks )
  stocks: (function() {
		return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
	    sortProperties: this.get('sortProperties'),
		sortAscending: this.get('sortAscending'),
	    content: this.get('content.stocks_only')
	  });
  }).property('content.stocks_only','sortProperties','sortAscending').cacheable(),

  sort: function(criteria) {
	this.set('sortProperties', [criteria]);

	direction = this.get('sortAscending') ;
	if (direction == true) { this.set('sortAscending', false) ;	}
	else { this.set('sortAscending', true) ; };    
  },

	total_dividends: function() {
	var total = 0 ;
			this.get('stocks').forEach(function(stock){
				total += stock.get('daily_dividend') * stock.get('quantity') ;			
			});
	return total 
	}.property('stocks.@each.daily_dividend'),
	
  	total_cost: function() {
	var total = 0 ;
			this.get('stocks').forEach(function(stock){
				total += stock.get('position_cost') ;			
			});
	return total 
	}.property('stocks.@each.position_cost'),
	
	total_value: function() {
	var total = 0 ;
			this.get('stocks').forEach(function(stock){
				total += stock.get('position_value') ;			
			});
	return total 
	}.property('stocks.@each.position_value'),

	  startEditing: function() {
	    var portfolioEditController = this.get('controllers.PortfolioEdit');
	    portfolioEditController.set('content', this.get('content'));
	    portfolioEditController.startEditing();
	    this.set('isEditing', true);
	  },

	  stopEditing: function() {
	    var portfolioEditController = this.get('controllers.PortfolioEdit');
	    portfolioEditController.stopEditing();
	    this.set('isEditing', false);
	  },

	refresh_timer: function(){
	  // do something
	  return this.get('clock') ;
	 }.property("clock.second").cacheable(),

	cancel: function() {
		this.transitionToRoute('portfolios');
  	},

	destroy: function(portfolio) {
	    if (window.confirm("Are you sure you want to delete this portfolio and its stocks?")) {
			portfolio.get('stocks').forEach(function(stock) {
				stock.deleteRecord() ;
			});
			portfolio.deleteRecord() ;
			this.store.commit();
	        this.transitionToRoute('portfolios');
		}
	}

});
