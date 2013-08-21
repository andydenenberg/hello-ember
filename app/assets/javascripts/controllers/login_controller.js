HelloEmber.LoginController = Ember.Controller.extend({
  needs: ['Application'],

  reset: function() {
    this.setProperties({
      email: "",
      password: "",
      errorMessage: ""
    });
  },

  login_token: localStorage.login_token, // initialize from memory during page refresh
  tokenChanged: function() {
	if (this.login_token == null) { 
		HelloEmber.set('logged_in_state', false );
		delete localStorage.logged_in_state; } // local storage can only store text, handlebars need boolean
	else { 
		HelloEmber.set('logged_in_state', true)
		localStorage.logged_in_state = true;  }
    localStorage.login_token = this.get('login_token');
  }.observes('login_token'),

  logout: function() {
		this.set('login_token', null);
  },

  login: function() {

    var self = this, data = this.getProperties('email', 'password');
    // Clear out any error messages.
    this.set('errorMessage', null);
	
    $.post('/auth.json', data).then(function(response) {

      self.set('errorMessage', response.message);
      if (response.token) {
//        alert('Login succeeded!');
        self.set('login_token', response.token);
		get_user() ;  // display on nav bar

		self.get('controllers.Application').initialize_data() ;

        var attemptedTransition = self.get('attemptedTransition');
        if (attemptedTransition) {
          attemptedTransition.retry();
          self.set('attemptedTransition', null);
        } else {
          // Redirect to 'portfolios' by default.
          self.transitionToRoute('portfolios');
        }
      }
    });
  }
});

