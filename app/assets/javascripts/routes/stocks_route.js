HelloEmber.StocksRoute = Ember.Route.extend({

  model: function() {
    // request all stocks from adapter
    return HelloEmber.Stock.find();
  },

  setupController: function(controller, model) {

	controller.set('model', model ) ;
	
  },


});