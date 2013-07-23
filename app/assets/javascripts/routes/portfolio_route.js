HelloEmber.PortfolioRoute = Ember.Route.extend({
	
  setupController: function(controller, model) {
	this.controller.set('content', model ) ;
    // highlight this portfolio as active
    this.controllerFor('portfolios').set('activePortfolioId', model.get('id'));		
  },

  deactivate: function() {
    var controller = this.controllerFor('portfolio');

    // un-highlight the active contact (perhaps temporarily)
    this.controllerFor('portfolios').set('activePortfolioId', null);
  }

});
