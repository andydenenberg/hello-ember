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
//	this.controllerFor('Application').consolidate();
//	
//	Ember.run.later(this, function(){
//	this.controllerFor('Application').cache_update();
//	}, 500);

  },


});