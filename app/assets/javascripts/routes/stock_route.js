HelloEmber.StockRoute = Ember.Route.extend({

  setupController: function(controller, model) {	
	this.controller.set('content', model ) ;
    this.controllerFor('stocks').set('activeStockId', model.get('id'));
  },

  deactivate: function() {
    // un-highlight the active contact (perhaps temporarily)
    this.controllerFor('stocks').set('activeStockId', null);
  }

});
