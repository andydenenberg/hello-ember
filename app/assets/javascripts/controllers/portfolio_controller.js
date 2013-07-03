HelloEmber.PortfolioController = Em.ObjectController.extend({
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
