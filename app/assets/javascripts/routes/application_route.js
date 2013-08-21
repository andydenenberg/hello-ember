HelloEmber.ApplicationRoute = Ember.Route.extend({
	
  setupController: function(controller, model) {
	controller.initialize_data()  },

  deactivate: function() {
  }

});
