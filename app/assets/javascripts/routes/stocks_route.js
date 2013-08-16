HelloEmber.StocksRoute = HelloEmber.AuthenticatedRoute.extend({
// redirect: function() {
//   if (!HelloEmber.get('logged_in_state')) {
//   	flash_message('You must first login to access Stocks.', 'warning') ;	
//   	this.transitionTo('login');		
//   }
// },

  model: function() {
    return HelloEmber.Stock.find();
  },

  setupController: function(controller, model) {
	controller.set('model', model ) ;
	Ember.run.later(this, function(){
	  // code here will execute within a RunLoop in about 2000ms with this == myContext
	this.controllerFor('Application').cache_update();
	}, 2000);

  },


});