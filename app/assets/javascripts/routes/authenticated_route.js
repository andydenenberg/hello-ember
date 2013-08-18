HelloEmber.AuthenticatedRoute = Ember.Route.extend({

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

  getJSONWithToken: function(url) {
    var token = this.controllerFor('login').get('token');
    return $.getJSON(url, { token: token });
  },

  events: {
    error: function(reason, transition) {
      if (reason.status === 401) {
        this.redirectToLogin(transition);
      } else {
        alert('Something went wrong');
      }
    }
  }
});
