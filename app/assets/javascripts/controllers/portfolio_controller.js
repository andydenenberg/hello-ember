HelloEmber.PortfolioController = Em.ObjectController.extend({
	isEditing: false,
	needs: ['PortfolioEdit'],
	
//	sortProperties: ['???'],
//    sortAscending: false,
//
// need to find a way to sort stocks.. sortProperties works with content..

//  	sort: function() {
//		direction = this.get('sortAscending') ;
//		if (direction == true) { this.set('sortAscending', false) ;	}
//		else { this.set('sortAscending', true) ; };    
//	  },
	
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

  	total_change: function() {
	var total = 0 ;
			this.get('stocks').forEach(function(stock){
				total += stock.get('daily_change') * stock.get('quantity');			
			});
	return total 
	}.property('stocks.@each.daily_change'),
  
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
