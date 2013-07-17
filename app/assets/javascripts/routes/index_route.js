HelloEmber.IndexRoute = Ember.Route.extend({
  redirect: function() {
	this.transitionTo('portfolios');
  }
});
