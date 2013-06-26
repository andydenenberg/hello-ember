HelloEmber.StocksEditRoute = Ember.Route.extend({
	
  setupController: function(controller, model) {
	controller.set('content', model ) ;
	controller.set('portfolio', model.get('portfolio') );	
	controller.set('all_ports',HelloEmber.Portfolio.find() );
	}

});
