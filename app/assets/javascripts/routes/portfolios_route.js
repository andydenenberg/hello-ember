HelloEmber.PortfoliosRoute = HelloEmber.AuthenticatedRoute.extend({  // Ember.Route.extend({
//  redirect: function() {
//	if (!HelloEmber.get('logged_in_state')) {
//		flash_message('You must first login to access System.', 'warning') ;	
//		this.transitionTo('login');		
//	}
//  },
//
  model: function() {
    return HelloEmber.Portfolio.find();
  },

  setupController: function(controller, model) {
	controller.set('model', model ) ;	
  },

});