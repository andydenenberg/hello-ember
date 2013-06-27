HelloEmber.StocksEditRoute = Ember.Route.extend({
	
  setupController: function(controller, model) {
	controller.set('content', model ) ;
	controller.set('portfolio', model.get('portfolio') );	
	controller.set('all_ports',HelloEmber.Portfolio.find() );
    this.controllerFor('stocks').set('activeStockId', model.get('id'));
  },

  deactivate: function() {
    // un-highlight the active contact (perhaps temporarily)
    this.controllerFor('stocks').set('activeStockId', null);
  }

});
