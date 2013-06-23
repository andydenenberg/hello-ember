HelloEmber.PortfoliosRoute = Ember.Route.extend({

  model: function() {
    return HelloEmber.Portfolio.find();
  },

  setupController: function(controller, model) {
	controller.set('model', model ) ;	
  },


});