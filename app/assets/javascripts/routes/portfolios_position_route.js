HelloEmber.PortfoliosPositionRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    this.controllerFor('portfolios').set('activePortfolioId', model.get('id'));
	controller.set('content', model ) ;
	controller.set('new_stock_symbol', null);
	controller.set('new_stock_price', null);
	controller.set('new_stock_quantity', null);
	controller.set('new_stock_price_change', null);
  },

  deactivate: function() {
    // un-highlight the active contact (perhaps temporarily)
    this.controllerFor('portfolios').set('activePortfolioId', null);
  },
	
  renderTemplate: function() {
    this.render('portfolios_position');
  },


});

