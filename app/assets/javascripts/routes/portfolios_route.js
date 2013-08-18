HelloEmber.PortfoliosRoute = HelloEmber.AuthenticatedRoute.extend({  

  model: function() {
    return HelloEmber.Portfolio.find();
  },

  setupController: function(controller, model) {
	controller.set('content', model ) ;	
	Ember.run.later(this, function(){
//		this.controllerFor('Application').cache_update();
	}, 2000);
  },

});