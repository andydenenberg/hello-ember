HelloEmber.IndexRoute = Ember.Route.extend({
  redirect: function() {
	this.transitionTo('portfolios');
//	this.transitionTo('home');
  }
});
