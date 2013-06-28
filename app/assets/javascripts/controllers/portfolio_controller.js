HelloEmber.PortfolioController = Em.ObjectController.extend({
  	needs: ['portfolios'],

	cancel: function() {
		this.transitionToRoute('portfolios');
  	},

	destroy: function() {
	    var PortfoliosController = this.get('controllers.portfolios');	
	    PortfoliosController.delete_portfolio(this.get('content'));
		this.transitionToRoute('portfolios');
	}

});
