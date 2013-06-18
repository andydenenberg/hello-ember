HelloEmber.PortfoliosRoute = Ember.Route.extend({

  model: function() {
    // request all stocks from adapter
    return HelloEmber.Portfolio.find();
  },

  setupController: function(controller, model) {

	controller.set('model', model ) ;
	
  },


});