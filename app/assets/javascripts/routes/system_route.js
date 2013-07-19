HelloEmber.SystemRoute = Ember.Route.extend({
  redirect: function() {
	if (!HelloEmber.get('logged_in_state')) {
		flash_message('You must first login to access System.', 'warning') ;	
		this.transitionTo('login');		
	}
  }

});