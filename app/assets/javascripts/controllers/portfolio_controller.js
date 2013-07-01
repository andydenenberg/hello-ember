HelloEmber.PortfolioController = Em.ObjectController.extend({
  	needs: ['portfolios'],

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
