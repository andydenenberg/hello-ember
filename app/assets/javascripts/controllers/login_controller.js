HelloEmber.LoginController = Ember.ObjectController.extend({
	username: '',
    password: '',

    Logout: function() {
		flash_message('See ya the soon', 'info') ;	
		// clear fields for next login
		this.set('username', '');
		this.set('password', '');
		HelloEmber.set('logged_in_user', null );
        HelloEmber.set('logged_in_state', false) ;
    },
      
    Login: function() {
      // Normally this would go to the server. Simulate that.
//      if(this.get('username') === App.USERNAME &&
//         this.get('password') === App.PASSWORD) {
      if(this.get('username') === 'andy' &&
         this.get('password') === 'xxx') {
        HelloEmber.set('logged_in_state', true) ;
		HelloEmber.set('logged_in_user', this.get('username') );
		
		// clear fields for next login
//        this.set('username', '');
//        this.set('password', '');

//		this.transitionToRoute('contacts.index');

      } else {	
		flash_message('Error: Invalid username or password.', 'info') ;	
        HelloEmber.set('logged_in_state', false) ;
      }

    }
});    
