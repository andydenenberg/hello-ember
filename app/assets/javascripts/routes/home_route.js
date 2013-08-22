HelloEmber.HomeRoute = HelloEmber.AuthenticatedRoute.extend({ 
	
	setupController: function(controller, model) {
			Ember.run.later(this, function(){
				this.controller.load_graph();
			}, 2000);
		
	},
  
});