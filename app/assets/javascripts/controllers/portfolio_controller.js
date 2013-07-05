HelloEmber.PortfolioController = Em.ObjectController.extend({

//  display_stocks: function() {
//	alert(this.get('stocks').get('length') > 0 ) ;
//	return this.get('stocks').get('length') > 0 
//  }.property('stocks'),
	
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
  
  	needs: ['Portfolios'],
	  isEditing: false,
	  needs: ['PortfolioEdit'],

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

	destroy: function() {
	    var PortfoliosController = this.get('controllers.portfolios');	
	    PortfoliosController.delete_portfolio(this.get('content'));
		this.transitionToRoute('portfolios');
	}

});
