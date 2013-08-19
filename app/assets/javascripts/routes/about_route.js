HelloEmber.AboutRoute = Ember.Route.extend({

// cannot make this a sub-class of Authenticted Route because is is created after this is created
// hacked it by placing the following code in line...
// need to refactor..
	
	  beforeModel: function(transition) {
		var token = this.controllerFor('login').get('login_token');
		if (token == 'null' || token == null ) {
	      this.redirectToLogin(transition);
	    }
	  },

	  redirectToLogin: function(transition) {
	//    alert('You must log in!');
	    var loginController = this.controllerFor('login');
	    loginController.set('attemptedTransition', transition);
	    this.transitionTo('login');
	  },
  
});