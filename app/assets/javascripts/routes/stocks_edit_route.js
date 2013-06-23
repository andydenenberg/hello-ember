HelloEmber.StocksEditRoute = Ember.Route.extend({
	
  setupController: function(controller, model) {
//    this.controllerFor('stocks.edit').set('originalStock_attr', model.get('data.attributes'));
	controller.set('model', model ) ;    
	}

});
