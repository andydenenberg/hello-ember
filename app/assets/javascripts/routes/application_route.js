HelloEmber.ApplicationRoute = Ember.Route.extend({
	
  setupController: function(controller, model) {
	controller.refresh_cache();
	Ember.run.later(this, function(){
	    controller.consolidate() ;
	}, 3000);

		Ember.run.later(this, function(){
			controller.refresh_cache();
		}, 3000);
  },

  deactivate: function() {
  }

});
