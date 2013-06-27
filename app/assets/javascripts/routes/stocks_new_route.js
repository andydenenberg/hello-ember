HelloEmber.StocksNewRoute = Ember.Route.extend({
  model: function() {
    // Because we are maintaining a transaction locally in the controller for editing,
    // the new record needs to be created in the controller.
    return null;
  },
	
  setupController: function(controller, model) {
	controller.set('all_ports', HelloEmber.Portfolio.find() );
	controller.createNew();
    this.controllerFor('stocks').set('activeStockId', 'new_stock_no_id_yet');
  },

  deactivate: function() {
    // un-highlight the active contact (perhaps temporarily)
    this.controllerFor('stocks').set('activeStockId', null);
  }

});
