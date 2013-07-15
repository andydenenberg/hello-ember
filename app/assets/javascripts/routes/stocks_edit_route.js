HelloEmber.StocksEditRoute = Ember.Route.extend({
	
  setupController: function(controller, model) {
	controller.set('content', model ) ;
	controller.set('portfolio', model.get('portfolio') );	
	controller.set('all_ports', HelloEmber.Portfolio.find() );
//	controller.set('securities', [ Ember.Object.create({name: "Stock", val: 0}), Ember.Object.create({name: "Call Option", val: 1}) ] );
    this.controllerFor('stocks').set('activeStockId', model.get('id'));
  },

  deactivate: function() {
    // un-highlight the active contact (perhaps temporarily)
    this.controllerFor('stocks').set('activeStockId', null);
  }

});
