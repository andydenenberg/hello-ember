HelloEmber.StocksRoute = Ember.Route.extend({

  model: function() {
    return HelloEmber.Stock.find();
  },

  setupController: function(controller, model) {
	controller.set('model', model ) ;	
  },


});